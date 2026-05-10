import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de Apollo Client
vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    vi.fn(() => Promise.resolve({ data: { register: { email: 'test@test.com' } } })),
    { loading: false, error: undefined },
  ]),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería exportar la función useRegister', async () => {
    const { useRegister } = await import('./useRegister');
    expect(useRegister).toBeDefined();
    expect(typeof useRegister).toBe('function');
  });
});