import { gender } from '../users/scripts/types';
import { priorityState, taskStatus } from '../task/scripts/task.types';

export const mockUser = {
  id: '1',
  email: 'test@test.com',
  password: 'hashedPassword123',
  fullName: 'Test User',
  gender: gender.male,
  deletedAt: null,
  tasks: [],
};

export const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: priorityState.media,
  status: taskStatus.pendiente,
  orderInStatus: 0,
  user: mockUser,
  deletedAt: null,
};

export const mockUserWithTasks = {
  ...mockUser,
  tasks: [mockTask],
};


export const createTaskDto = {
  title: 'New Task',
  description: 'New Description',
  priority: priorityState.alta,
};

export const updateTaskDto = {
  title: 'Updated Task',
  description: 'Updated Description',
};

export const createUserDto = {
  email: 'newuser@test.com',
  password: 'password123',
  fullName: 'New User',
  gender: gender.male,
};

export const updateUserDto = {
  fullName: 'Updated Name',
};

export const loginDto = {
  email: 'test@test.com',
  password: 'password123',
};