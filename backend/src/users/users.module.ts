import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../task/task.module'
import { UsersResolver } from './users.resolver';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task]),
    TaskModule
  ],
  providers: [UsersService, UsersResolver] as const,
  controllers: [UsersController] as const,
})
export class UsersModule { }
