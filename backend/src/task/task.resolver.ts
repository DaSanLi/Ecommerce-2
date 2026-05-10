import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Task } from './entities/task.entity';
import type { ReqTaskAuth } from './scripts/task.types';

@UseGuards(AuthGuard)
@Resolver()
export class TaskResolver {

    constructor(private readonly taskService: TaskService) {}


    @UsePipes(new ValidationPipe)
    @Mutation(() => String, {description: "Crea una nueva tarea"})
    createTask(@Args('createTaskDto') createTaskDto: CreateTaskDto, @Context('req') req: ReqTaskAuth) {
        return this.taskService.createTask(createTaskDto, req.user);
    }


    @Query(() => [Task], {description: "Encuentra todas las tareas creadas por el usuario"})
    findAllTasks(@Context('req') req: ReqTaskAuth) {
        return this.taskService.findAllTask(req.user);
    }


    @Query(() => Task, {description: "Encuentra una tarea por el identificador de la tarea"})
    findOneTask(@Args('id') id: string, @Context('req') req: ReqTaskAuth) {
        return this.taskService.findOneTask(id, req.user);
    }


    @Mutation(() => String, {description: "Actualiza una tarea por el identificador de la tarea"})
    updateTask(@Args('id') id: string, @Args('updateTaskDto') updateTaskDto: UpdateTaskDto, @Context('req') req: ReqTaskAuth) {
        return this.taskService.updateTask(id, updateTaskDto, req.user);
    }


    @Mutation(() => String, {description: "Eliminar una tarea por el identificador"})
    removeTask(@Args('id') id: string, @Context('req') req: ReqTaskAuth) {
        return this.taskService.removeTask(id, req.user);
    }

    @UsePipes(new ValidationPipe)
    @Mutation(() => String, {description: "Mueve una tarea a un nuevo estado y orden"})
    moveTask(@Args('id') id: string, @Args('moveTaskDto') moveTaskDto: UpdateTaskDto, @Context('req') req: ReqTaskAuth) {
        const { status, orderInStatus } = moveTaskDto
        return this.taskService.moveTask(id, { status, orderInStatus }, req.user);
    }

}
