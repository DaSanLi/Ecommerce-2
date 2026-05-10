import { ReactNode } from 'react';
import { MockedProvider as ApolloMockedProvider, MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

// Variables para almacenar los mocks
letMocks = {};
letError = null;

// Variables reactivas para almacenar mocks
const reactiveMocks = {
  isMock: false,
  mocks: [],
  error: null,
};

// Query y mutation mocks
const QUERY_MOCKS = new Map();
const MUTATION_MOCKS = new Map();

// Función para adicionar query mock
export function addQueryMock(query, mockData, error = null) {
  QUERY_MOCKS.set(query, { mockData, error });
}

// Función para adicionar mutation mock
export function addMutationMock(mutation, mockData, error = null) {
  MUTATION_MOCKS.set(mutation, { mockData, error });
}

// Limpiar todos los mocks
export function clearAllMocks() {
  QUERY_MOCKS.clear();
  MUTATION_MOCKS.clear();
}

// Crear link mock
function createMockLink() {
  return new MockLink([]);
}

// Provider mock para Apollo Client
export function MockedProvider({ children, mocks = [], addTypename = true }: {
  children: ReactNode;
  mocks?: any[];
  addTypename?: boolean;
}) {
  return (
    <ApolloMockedProvider mocks={mocks} addTypename={addTypename}>
      {children}
    </ApolloMockedProvider>
  );
}

// Wrapper para tests con Apollo
export function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <MockedProvider>
      {children}
    </MockedProvider>
  );
}

// Datos mock comunes
export const mockUser = {
  id: '1',
  email: 'test@test.com',
  fullName: 'Test User',
  gender: 'male',
};

export const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'media',
  status: 'pendiente',
  orderInStatus: 0,
};

export const mockTasks = [
  mockTask,
  { id: '2', title: 'Task 2', description: 'Desc 2', priority: 'alta', status: 'pendiente', orderInStatus: 1 },
];

// Mock para login/success
export const mockLoginSuccess = {
  login: { email: 'test@test.com' },
};

// Mock para register success
export const mockRegisterSuccess = {
  register: { email: 'new@test.com' },
};

// Mock para verification
export const mockVerification = {
  verification: { email: 'test@test.com', message: 'Verificación exitosa' },
};

// Mock para me
export const mockMe = {
  me: mockUser,
};

// Mock para createTask
export const mockCreateTask = {
  createTask: 'Tarea creada correctamente',
};

// Mock para findAllTasks
export const mockFindAllTasks = {
  findAllTasks: mockTasks,
};

// Mock para updateTask
export const mockUpdateTask = {
  updateTask: 'Tarea modificada satisfactoriamente',
};

// Mock para removeTask
export const mockRemoveTask = {
  removeTask: 'Tarea borrada satisfactoriamente',
};

// Mock para moveTask
export const mockMoveTask = {
  moveTask: 'Tarea movida satisfactoriamente',
};

export { ApolloMockedProvider } from '@apollo/client/testing';