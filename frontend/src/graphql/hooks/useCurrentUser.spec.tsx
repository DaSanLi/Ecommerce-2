import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(() => ({
    data: { me: null },
    loading: false,
    error: undefined,
    refetch: vi.fn(),
  })),
}));

describe('useCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useCurrentUser', async () => {
    const { useCurrentUser } = await import('./useCurrentUser');
    expect(useCurrentUser).toBeDefined();
    expect(typeof useCurrentUser).toBe('function');
  });
});