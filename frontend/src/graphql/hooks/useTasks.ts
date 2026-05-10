import { useQuery } from '@apollo/client/react';
import { FIND_ALL_TASKS } from '../queries/tasks';
import { Task } from '../../components/dashboard/TaskList/types';

interface FindAllTasksData {
  findAllTasks: Task[];
}

export function useTasks() {
  const { data, loading, error, refetch } = useQuery<FindAllTasksData>(FIND_ALL_TASKS, {
    context: {
      credentials: 'include',
    },
  });

  const tasks: Task[] = data?.findAllTasks || [];

  return { tasks, loading, error, refetch };
}
