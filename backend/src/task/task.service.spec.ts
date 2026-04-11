import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: any;
  let userRepository: any;

  const mockUser = {
    id: '1',
    email: 'test@test.com',
    password: 'hashedPassword123',
    fullName: 'Test User',
    gender: 'male' as any,
    deletedAt: null,
    tasks: [],
  };

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'media',
    status: 'pendiente',
    orderInStatus: 0,
    user: mockUser,
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get(getRepositoryToken(Task));
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('debería crear una tarea correctamente', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Nueva Tarea',
        description: 'Descripción de prueba',
        priority: 'alta' as any,
      };
      const userEmail = { email: 'test@test.com' };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      taskRepository.save.mockResolvedValue({ ...createTaskDto, user: mockUser });

      const result = await service.createTask(createTaskDto, userEmail);

      expect(result).toBe('Tarea creada correctamente');
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(taskRepository.save).toHaveBeenCalled();
    });

    it('debería fallar si el usuario no existe', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Nueva Tarea',
        description: 'Descripción',
        priority: 'media' as any,
      };
      const userEmail = { email: 'noexiste@test.com' };

      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.createTask(createTaskDto, userEmail)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllTask', () => {
    it('debería retornar todas las tareas del usuario', async () => {
      const userEmail = { email: 'test@test.com' };
      const userWithTasks = {
        ...mockUser,
        tasks: [mockTask],
      };

      userRepository.findOne.mockResolvedValue(userWithTasks);

      const result = await service.findAllTask(userEmail);

      expect(result).toEqual([mockTask]);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        relations: ['tasks'],
      });
    });

    it('debería fallar si el usuario no existe', async () => {
      const userEmail = { email: 'noexiste@test.com' };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findAllTask(userEmail)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneTask', () => {
    it('debería retornar una tarea específica', async () => {
      const taskId = '1';
      const userEmail = { email: 'test@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOneTask(taskId, userEmail);

      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['user'],
      });
    });

    it('debería fallar si la tarea no existe', async () => {
      const taskId = '999';
      const userEmail = { email: 'test@test.com' };

      taskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneTask(taskId, userEmail)).rejects.toThrow(BadRequestException);
    });

    it('debería fallar si el usuario no es el creador', async () => {
      const taskId = '1';
      const userEmail = { email: 'otro@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);

      await expect(service.findOneTask(taskId, userEmail)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea correctamente', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarea Actualizada',
        description: 'Nueva descripción',
      };
      const userEmail = { email: 'test@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateTask(taskId, updateTaskDto, userEmail);

      expect(result).toBe('Tarea modificada satisfactoriamente');
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it('debería fallar si el usuario no es el creador', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = { title: 'Nueva' };
      const userEmail = { email: 'otro@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);

      await expect(service.updateTask(taskId, updateTaskDto, userEmail)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('removeTask', () => {
    it('debería eliminar una tarea correctamente', async () => {
      const taskId = '1';
      const userEmail = { email: 'test@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.remove.mockResolvedValue(mockTask);

      const result = await service.removeTask(taskId, userEmail);

      expect(result).toBe('Tarea borrada satisfactoriamente');
      expect(taskRepository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('debería fallar si el usuario no es el creador', async () => {
      const taskId = '1';
      const userEmail = { email: 'otro@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);

      await expect(service.removeTask(taskId, userEmail)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('moveTask', () => {
    it('debería mover una tarea a un nuevo estado', async () => {
      const taskId = '1';
      const moveDto = { status: 'en_proceso' as any, orderInStatus: 2 };
      const userEmail = { email: 'test@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.moveTask(taskId, moveDto, userEmail);

      expect(result).toBe('Tarea movida satisfactoriamente');
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, {
        status: 'en_proceso',
        orderInStatus: 2,
      });
    });

    it('debería mantener el estado actual si no se especifica nuevo estado', async () => {
      const taskId = '1';
      const moveDto = { status: undefined, orderInStatus: 3 };
      const userEmail = { email: 'test@test.com' };

      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.moveTask(taskId, moveDto, userEmail);

      expect(result).toBe('Tarea movida satisfactoriamente');
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, {
        status: 'pendiente',
        orderInStatus: 3,
      });
    });
  });
});