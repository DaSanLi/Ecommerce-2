import { useMutation } from '@apollo/client/react';
import { CREATE_TASK } from '../mutations/tasks';

interface CreateTaskInput {
  title: string;
  priority: string;
  description: string;
}

interface CreateTaskData {
  createTask: string;
}

export function useCreateTask(onCompleted?: () => void) {
  const [createTask, { loading, error }] = useMutation<CreateTaskData>(CREATE_TASK);

  const handleCreateTask = async (input: CreateTaskInput) => {
    try {
      await createTask({
        variables: {
          createTaskDto: {
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
      console.error('Error al crear tarea:', err);
    }
  };

  return { handleCreateTask, loading, error };
}
