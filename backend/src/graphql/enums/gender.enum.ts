import { registerEnumType } from '@nestjs/graphql';
import { gender } from '../../users/scripts/types';

registerEnumType(gender, {
  name: 'Gender',
  description: 'Género del usuario (male, female)',
});
