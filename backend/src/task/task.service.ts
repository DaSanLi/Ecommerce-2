import { Injectable, Logger, InternalServerErrorException, UnauthorizedException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity'
import { User } from '../users/entities/user.entity'
import { taskStatus } from './scripts/task.types';
import { CACHE_KEYS, taskCacheOptions } from '../cache/cache.config';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task) private readonly TaskRepository: Repository<Task>,
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }


  async createTask(createTaskDto: CreateTaskDto, { email }: { email: string }): Promise<string> {
    const user = await this.UserRepository.findOneBy({ email })
    
    if (!user) {
      throw new NotFoundException('El usuario no esta registrado o fue eliminado.');
    }
    
    const newTask = { 
      ...createTaskDto, 
      status: createTaskDto.status ?? taskStatus.pendiente,
      orderInStatus: createTaskDto.orderInStatus ?? 0,
      user: user 
    };
    
    try {
      await this.TaskRepository.save(newTask);
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Ha ocurrido un error al registrar la tarea, vuelve a intentarlo.');
    }
    
    // Invalidar cache de tareas del usuario
    await this.cacheManager.del(CACHE_KEYS.ALL_TASKS(email));
    
    return 'Tarea creada correctamente';
  }



  async findAllTask({ email }: { email: string }): Promise<Task[]> {
    const cacheKey = CACHE_KEYS.ALL_TASKS(email);
    
    // Intentar obtener del cache primero
    const cachedTasks = await this.cacheManager.get<Task[]>(cacheKey);
    if (cachedTasks) {
      this.logger.debug(`Cache hit for tasks: ${email}`);
      return cachedTasks;
    }
    
    const user: User | null = await this.UserRepository.findOne({ 
      where: { email }, 
      relations: ['tasks'] 
    });
    
    if (!user) {
      throw new NotFoundException('No se ha podido encontrar al usuario, vuelve a intentarlo');
    }
    
    const { tasks } = user;
    
    if (!tasks) {
      throw new InternalServerErrorException('No se han podido cargar las tareas de este usuario');
    }
    
    // Guardar en cache
    await this.cacheManager.set(cacheKey, tasks, taskCacheOptions.ttl);
    
    return tasks;
  }


  async findOneTask(id: string, { email }: { email: string }): Promise<Task> {
    const task: Task | null = await this.TaskRepository.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    
    if (!task) {
      throw new NotFoundException('No se ha encontrado ninguna tarea');
    }
    
    if (email !== task.user.email) {
      throw new UnauthorizedException('Solo el creador de la tarea puede ver la misma');
    }
    
    return task;
  }


  async updateTask(id: string, updateTaskDto: UpdateTaskDto, { email }: { email: string }): Promise<string> {
    const task: Task | null = await this.TaskRepository.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    
    if (!task) {
      throw new NotFoundException('No se ha encontrado ninguna tarea');
    }
    
    if (email !== task?.user?.email) {
      throw new UnauthorizedException('Solo el creador de la tarea puede modificar la misma');
    }
    
    try {
      await this.TaskRepository.update(id, { ...updateTaskDto });
    } catch (error) {
      this.logger.error(`Error updating task: ${error.message}`, error.stack);
      throw new InternalServerErrorException('La tarea no se ha podido modificar');
    }
    
    // Invalidar cache
    await this.cacheManager.del(CACHE_KEYS.ALL_TASKS(email));
    
    return 'Tarea modificada satisfactoriamente';
  }


  async removeTask(id: string, { email }: { email: string }): Promise<string> {
    const task: Task | null = await this.TaskRepository.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    
    if (!task) {
      throw new NotFoundException('No se ha encontrado ninguna tarea');
    }
    
    if (email !== task?.user?.email) {
      throw new UnauthorizedException('Solo el creador de la tarea puede eliminar la misma');
    }
    
    try {
      await this.TaskRepository.remove(task);
    } catch (error) {
      this.logger.error(`Error removing task: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error al borrar la tarea');
    }
    
    // Invalidar cache
    await this.cacheManager.del(CACHE_KEYS.ALL_TASKS(email));
    
    return 'Tarea borrada satisfactoriamente';
  }

  async moveTask(
    id: string, 
    { status, orderInStatus }: { status: taskStatus | undefined; orderInStatus: number | undefined }, 
    { email }: { email: string }
  ): Promise<string> {
    const task: Task | null = await this.TaskRepository.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    
    if (!task) {
      throw new NotFoundException('No se ha encontrado ninguna tarea');
    }
    
    if (email !== task?.user?.email) {
      throw new UnauthorizedException('Solo el creador de la tarea puede mover la mesma');
    }
    
    try {
      await this.TaskRepository.update(id, { 
        orderInStatus: orderInStatus ? orderInStatus : task.orderInStatus,
        status: status ? status : task.status,
      });
    } catch (error) {
      this.logger.error(`Error moving task: ${error.message}`, error.stack);
      throw new InternalServerErrorException('La tarea no se ha podido mover');
    }
    
    // Invalidar cache
    await this.cacheManager.del(CACHE_KEYS.ALL_TASKS(email));
    
    return 'Tarea movida satisfactoriamente';
  }
}