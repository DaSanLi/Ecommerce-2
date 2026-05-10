import { IsString,  MinLength, MaxLength, IsNotEmpty, IsEnum } from 'class-validator';
import { priorityState, taskStatus } from '../scripts/task.types'
import { Field, InputType, Int } from '@nestjs/graphql';


@InputType({ description: "Para crear una nueva tarea se deben proporcionar todos los campos"})
export class CreateTaskDto { 

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    @IsNotEmpty()
    @Field()
    title?: string;

    @IsEnum(priorityState)
    @Field({ description: "Solo hay 4 estados para nombrar este campo (bajo, medio, alto, urgente)"})
    priority?: priorityState; 

    @MinLength(1)
    @IsString()
    @Field()
    description?: string;
    
    @Field(() => String, { description: "Estado de la tarea en el tablero Kanban" })
    status: taskStatus = taskStatus.pendiente;

    @Field(() => Int, { description: "Orden de la tarea dentro de su estado" })
    orderInStatus: number = 0;

}
