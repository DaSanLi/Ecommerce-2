import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../mutations/auth';
import { useRouter } from 'next/navigation';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginData {
  login: {
    email: string;
  };
}

export function useLogin() {
  const router = useRouter();
  
  const [login, { loading, error }] = useMutation<LoginData>(LOGIN);

  const handleLogin = async (input: LoginInput) => {
    try {
      const { data } = await login({
        variables: {
          body: {
            email: input.email,
            password: input.password,
          },
        },
        context: {
          credentials: 'include',
        },
      });
      
      if (data?.login?.email) {
        router.replace('/dashboard');
      }
      
      return data;
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      throw err;
    }
  };

  return { handleLogin, loading, error };
}
