import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(() => ({
    data: { findAllTasks: [] },
    loading: false,
    error: undefined,
    refetch: vi.fn(),
  })),
}));

describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useTasks', async () => {
    const { useTasks } = await import('./useTasks');
    expect(useTasks).toBeDefined();
    expect(typeof useTasks).toBe('function');
  });
});