import { 
  Injectable, 
  Logger, 
  BadRequestException, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../auth/scripts/auth.scripts';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    @InjectRepository(Task) private readonly TaskRepository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) { }


  async createUser(body: CreateUserDto): Promise<User> {
    console.log("se ejecuta create user")

    const passwordHashed = await hashPassword(body.password);
    body.password = passwordHashed;
    
    const newUser = await this.UserRepository.save(body);
    
    if (!newUser) {
      this.logger.error('Failed to create user');
      throw new InternalServerErrorException('No se ha podido registrar al usuario');
    }
    
    return newUser;
  }


  async findAllUsers(): Promise<User[]> {
    return await this.UserRepository.find();
  }


  async findOneUser(id: string): Promise<User> {
    const user = await this.UserRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('No se ha encontrado un usuario referente');
    }
    
    return user;
  }


  async updateUser(id: string, body: UpdateUserDto): Promise<string> {
    const user = await this.UserRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('No se ha encontrado un usuario referente');
    }
    
    if (body?.password) {
      const passwordHashed = await hashPassword(body.password);
      body.password = passwordHashed;
    }
    
    const updatedUser = await this.UserRepository.update(id, { ...body });
    
    if (!updatedUser) {
      throw new InternalServerErrorException('No se ha podido actualizar el usuario');
    }
    
    return 'Usuario actualizado con exito';
  }


  async softDeleteUSer(id: string): Promise<string> {
    const user = await this.UserRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    // Usar transacción para operaciones atómicas
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const fecha = new Date();
      
      // Soft delete del usuario
      await queryRunner.manager.softDelete(User, { id });
      
      // Soft delete de las tareas del usuario
      await queryRunner.manager
        .createQueryBuilder()
        .update(Task)
        .set({ deletedAt: fecha })
        .where('userId = :id', { id })
        .execute();
      
      await queryRunner.commitTransaction();
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error in softDeleteUser: ${error.message}`, error.stack);
      throw new InternalServerErrorException('El usuario no se pudo borrar');
    } finally {
      await queryRunner.release();
    }
    
    return 'Se realizo el borrado blando del usuario satisfactoriamente';
  }


  async cancelSoftDelete(id: string): Promise<string> {
    // Buscar usuarios previamente borrados
    const usersDeletedRepository = await this.UserRepository.find({ 
      withDeleted: true, 
      where: { deletedAt: Not(IsNull()) } 
    });
    
    // Verificar si el id enviado está en la lista de usuarios eliminados
    const userIsDeleted = usersDeletedRepository.find((u) => String(u.id) === String(id));
    
    if (!userIsDeleted) {
      throw new NotFoundException('Usuario no encontrado en la lista de borrado blando');
    }
    
    // Usar transacción para operaciones atómicas
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Restaurar usuario
      await queryRunner.manager.restore(User, { id });
      
      // Restaurar tareas del usuario
      await queryRunner.manager
        .createQueryBuilder()
        .update(Task)
        .set({ deletedAt: null })
        .where('userId = :id', { id })
        .execute();
      
      await queryRunner.commitTransaction();
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error in cancelSoftDelete: ${error.message}`, error.stack);
      throw new InternalServerErrorException('No se pudo restaurar al usuario');
    } finally {
      await queryRunner.release();
    }
    
    return 'Se quito al usuario de la lista de borrado blando satisfactoriamente';
  }


  async hardDelete(id: string): Promise<string> {
    const user = await this.UserRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    try {
      await this.UserRepository.remove(user);
    } catch (error) {
      this.logger.error(`Error in hardDelete: ${error.message}`, error.stack);
      throw new InternalServerErrorException('No se ha podido borrar al usuario');
    }
    
    return 'Usuario borrado satisfactoriamente';
  }
}