import { PartialType, InputType } from '@nestjs/graphql';
import { CreateTaskDto } from './create-task.dto';

@InputType()
export class UpdateTaskDto extends PartialType(CreateTaskDto){}
