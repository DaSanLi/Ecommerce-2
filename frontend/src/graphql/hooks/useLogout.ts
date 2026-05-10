import { useMutation } from '@apollo/client/react';
import { LOGOUT } from '../mutations/auth';
import { useRouter } from 'next/navigation';

interface LogoutData {
  logout: string;
}

export function useLogout() {
  const router = useRouter();
  
  const [logout, { loading, error }] = useMutation<LogoutData>(LOGOUT);

  const handleLogout = async () => {
    try {
      await logout({
        context: {
          credentials: 'include',
        },
      });
      router.push('/auth/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return { handleLogout, loading, error };
}
