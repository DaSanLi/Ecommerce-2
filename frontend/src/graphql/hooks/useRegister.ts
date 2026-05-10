import { useMutation } from '@apollo/client/react';
import { REGISTER } from '../mutations/auth';
import { useRouter } from 'next/navigation';

interface RegisterInput {
  email: string;
  fullName: string;
  password: string;
  gender: string;
}

interface RegisterData {
  register: {
    email: string;
  };
}

export function useRegister() {
  const router = useRouter();
  
  const [register, { loading, error }] = useMutation<RegisterData>(REGISTER);

  const handleRegister = async (input: RegisterInput) => {
    try {
      const { data } = await register({
        variables: {
          body: {
            email: input.email,
            fullName: input.fullName,
            password: input.password,
            gender: input.gender,
          },
        },
        context: {
          credentials: 'include',
        },
      });
      
      if (data?.register?.email) {
        router.replace('/dashboard');
      }
      
      return data;
    } catch (err) {
      console.error('Error al registrar:', err);
      throw err;
    }
  };

  return { handleRegister, loading, error };
}
