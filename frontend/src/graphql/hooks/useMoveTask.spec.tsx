import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    vi.fn(() => Promise.resolve({ data: { moveTask: 'Tarea movida' } })),
    { loading: false },
  ]),
}));

describe('useMoveTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useMoveTask', async () => {
    const { useMoveTask } = await import('./useMoveTask');
    expect(useMoveTask).toBeDefined();
    expect(typeof useMoveTask).toBe('function');
  });
});