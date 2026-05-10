import { useMutation } from '@apollo/client/react';
import { REMOVE_TASK } from '../mutations/tasks';
import { FIND_ALL_TASKS } from '../queries/tasks';

interface RemoveTaskData {
  removeTask: string;
}

export function useDeleteTask(onCompleted?: () => void) {
  const [removeTask, { loading, error }] = useMutation<RemoveTaskData>(REMOVE_TASK, {
    refetchQueries: [{ query: FIND_ALL_TASKS }],
  });

  const handleDeleteTask = async (id: string) => {
    try {
      await removeTask({
        variables: { id },
        context: {
          credentials: 'include',
        },
        onCompleted: () => {
          if (onCompleted) onCompleted();
        },
      });
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  return { handleDeleteTask, loading, error };
}
