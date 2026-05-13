import { registerEnumType } from '@nestjs/graphql';
import { priorityState } from '../../task/scripts/task.types';

registerEnumType(priorityState, {
  name: 'PriorityState',
  description: 'Prioridad de la tarea (baja, media, alta, urgente)',
});
