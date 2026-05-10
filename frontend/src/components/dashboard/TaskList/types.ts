export type taskStatus = 'pendiente' | 'asignada' | 'realizando' | 'completada'

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: taskStatus;
    orderInStatus: number;
}
