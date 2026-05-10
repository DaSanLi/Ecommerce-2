import { useMutation } from '@apollo/client/react';
import { UPDATE_TASK } from '../mutations/tasks';

interface UpdateTaskInput {
  title?: string;
  priority?: string;
  description?: string;
}

interface UpdateTaskData {
  updateTask: string;
}

export function useUpdateTask(onCompleted?: () => void) {
  const [updateTask, { loading, error }] = useMutation<UpdateTaskData>(UPDATE_TASK);

  const handleUpdateTask = async (id: string, input: UpdateTaskInput) => {
    try {
      await updateTask({
        variables: {
          id,
          updateTaskDto: {
            title: input.title,
            priority: input.priority,
            description: input.description,
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
      console.error('Error al actualizar tarea:', err);
    }
  };

  return { handleUpdateTask, loading, error };
}
