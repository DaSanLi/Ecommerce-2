import { registerEnumType } from '@nestjs/graphql';
import { taskStatus } from '../../task/scripts/task.types';

registerEnumType(taskStatus, {
    name: 'taskStatus',
    description: 'Estado de la tarea (pendiente, asignada, realizando, completada)',
});

export { taskStatus };
