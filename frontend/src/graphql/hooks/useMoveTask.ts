import { useMutation } from '@apollo/client/react';
import { MOVE_TASK } from '../mutations/tasks';
import { FIND_ALL_TASKS } from '../queries/tasks';

interface MoveTaskResult {
    success: boolean;
    error?: string;
}

export function useMoveTask() {
    const [moveTaskMutation, { loading }] = useMutation(MOVE_TASK);

    async function moveTask(id: string, newStatus: string, newOrder: number): Promise<MoveTaskResult> {
        try {
            await moveTaskMutation({
                variables: {
                    id,
                    moveTaskDto: {
                        status: newStatus,
                        orderInStatus: newOrder,
                    },
                },
                update(cache, { data }) {
                    // Leer la query existente del cache
                    const existingTasks = cache.readQuery({ query: FIND_ALL_TASKS }) as any;
                    if (existingTasks && existingTasks.findAllTasks) {
                        // Actualizar la tarea movida
                        const updatedTasks = existingTasks.findAllTasks.map((task: any) => {
                            if (task.id === id) {
                                return { ...task, status: newStatus, orderInStatus: newOrder };
                            }
                            return task;
                        });
                        // Escribir de nuevo al cache
                        cache.writeQuery({
                            query: FIND_ALL_TASKS,
                            data: {
                                findAllTasks: updatedTasks,
                            },
                        });
                    }
                },
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al mover la tarea';
            console.error('Error moving task:', error);
            return { success: false, error: errorMessage };
        }
    }

    return { moveTask, loading };
}
