import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    vi.fn(() => Promise.resolve({ data: { logout: 'Sesión cerrada' } })),
    { loading: false, error: undefined },
  ]),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useLogout', async () => {
    const { useLogout } = await import('./useLogout');
    expect(useLogout).toBeDefined();
    expect(typeof useLogout).toBe('function');
  });
});