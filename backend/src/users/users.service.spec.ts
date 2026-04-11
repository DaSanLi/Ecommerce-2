import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { gender } from './scripts/types';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;
  let taskRepository: any;

  const mockUser = {
    id: '1',
    email: 'test@test.com',
    password: 'hashedPassword123',
    fullName: 'Test User',
    gender: gender.male,
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            remove: jest.fn(),
            restore: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              update: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue({ affected: 1 }),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    taskRepository = module.get(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debería crear un usuario correctamente', async () => {
      const createUserDto = {
        email: 'new@test.com',
        password: 'password123',
        fullName: 'New User',
        gender: gender.male,
      };

      userRepository.save.mockResolvedValue({ ...createUserDto, id: '2' });

      const result = await service.createUser(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe('new@test.com');
    });
  });

  describe('findAllUsers', () => {
    it('debería retornar todos los usuarios', async () => {
      userRepository.find.mockResolvedValue([mockUser]);

      const result = await service.findAllUsers();

      expect(result).toEqual([mockUser]);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOneUser', () => {
    it('debería retornar un usuario por id', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOneUser('1');

      expect(result).toEqual(mockUser);
    });

    it('debería lanzar excepción si el usuario no existe', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneUser('999')).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario correctamente', async () => {
      const updateUserDto = { fullName: 'Nuevo Nombre' };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateUser('1', updateUserDto);

      expect(result).toBe('Usuario actualizado con exito');
      expect(userRepository.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('debería lanzar excepción si el usuario no existe', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateUser('999', { fullName: 'Test' })).rejects.toThrow();
    });
  });

  describe('softDeleteUSer', () => {
    it('debería realizar borrado blando correctamente', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      userRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.softDeleteUSer('1');

      expect(result).toBe('Se realizo el borrado blando del usuario satisfactoriamente');
      expect(userRepository.softDelete).toHaveBeenCalledWith({ id: '1' });
    });

    it('debería lanzar excepción si el usuario no existe', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.softDeleteUSer('999')).rejects.toThrow();
    });
  });

  describe('cancelSoftDelete', () => {
    it('debería restaurar un usuario eliminado', async () => {
      const deletedUser = { ...mockUser, deletedAt: new Date() };

      userRepository.find.mockResolvedValue([deletedUser]);
      userRepository.restore.mockResolvedValue({ affected: 1 });

      const result = await service.cancelSoftDelete('1');

      expect(result).toBe('Se quito al usuario de la lista de borrado blando satisfactoriamente');
    });

    it('debería lanzar excepción si el usuario no está en la lista de eliminados', async () => {
      userRepository.find.mockResolvedValue([]);

      await expect(service.cancelSoftDelete('999')).rejects.toThrow();
    });
  });

  describe('hardDelete', () => {
    it('debería eliminar permanentemente un usuario', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      userRepository.remove.mockResolvedValue(mockUser);

      const result = await service.hardDelete('1');

      expect(result).toBe('Usuario borrado satisfactoriamente');
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('debería lanzar excepción si el usuario no existe', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.hardDelete('999')).rejects.toThrow();
    });
  });
});