import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    vi.fn(() => Promise.resolve({ data: { removeTask: 'Tarea eliminada' } })),
    { loading: false, error: undefined },
  ]),
}));

describe('useDeleteTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useDeleteTask', async () => {
    const { useDeleteTask } = await import('./useDeleteTask');
    expect(useDeleteTask).toBeDefined();
    expect(typeof useDeleteTask).toBe('function');
  });
});