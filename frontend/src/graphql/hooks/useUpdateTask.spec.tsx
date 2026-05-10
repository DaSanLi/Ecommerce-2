import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    vi.fn(() => Promise.resolve({ data: { updateTask: 'Tarea actualizada' } })),
    { loading: false, error: undefined },
  ]),
}));

describe('useUpdateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useUpdateTask', async () => {
    const { useUpdateTask } = await import('./useUpdateTask');
    expect(useUpdateTask).toBeDefined();
    expect(typeof useUpdateTask).toBe('function');
  });
});