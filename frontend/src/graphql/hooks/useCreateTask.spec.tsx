import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    vi.fn(() => Promise.resolve({ data: { createTask: 'Tarea creada' } })),
    { loading: false, error: undefined },
  ]),
}));

describe('useCreateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useCreateTask', async () => {
    const { useCreateTask } = await import('./useCreateTask');
    expect(useCreateTask).toBeDefined();
    expect(typeof useCreateTask).toBe('function');
  });
});