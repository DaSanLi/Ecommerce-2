import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock del módulo completo de Apollo Client
vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(() => [
    vi.fn(() => Promise.resolve({ data: { login: { email: 'test@test.com' } } })),
    { loading: false, error: undefined },
  ]),
  useQuery: vi.fn(() => ({
    data: undefined,
    loading: false,
    error: undefined,
    refetch: vi.fn(),
  })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería estar definido', async () => {
    // Import dinámico para evitar problemas de hoisting
    const { useLogin } = await import('./useLogin');
    const { result } = renderHook(() => useLogin());
    
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('handleLogin');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
  });
});