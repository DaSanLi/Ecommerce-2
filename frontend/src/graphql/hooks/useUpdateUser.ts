import { useMutation } from '@apollo/client/react';
import { UPDATE_USER } from '../mutations/auth';

interface UpdateUserInput {
  email?: string;
  fullName?: string;
  password?: string;
  gender?: string;
}

interface UpdateUserData {
  updateUser: string;
}

export function useUpdateUser(onCompleted?: () => void) {
  const [updateUser, { loading, error }] = useMutation<UpdateUserData>(UPDATE_USER);

  const handleUpdateUser = async (id: string, input: UpdateUserInput) => {
    try {
      await updateUser({
        variables: {
          id,
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
        onCompleted: () => {
          if (onCompleted) onCompleted();
        },
      });
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      throw err;
    }
  };

  return { handleUpdateUser, loading, error };
}
