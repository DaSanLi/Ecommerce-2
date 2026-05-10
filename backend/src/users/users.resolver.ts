import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver()
export class UsersResolver {


    constructor(private readonly usersService: UsersService) { }


    @Query(() => [User], {description: "Trae todos los usuarios registrados"})
    findAllUsers() {
        return this.usersService.findAllUsers();
    }


    @Query(() => User, {description: "Encuentra un usuario por su identificador"})
    findOneUser(@Args("id") id: string) {
        return this.usersService.findOneUser(id);
    }

    @UsePipes(new ValidationPipe)
    @Mutation(() => String, {description: "Actualiza las credenciales de un usuario existente"})
    updateUser(@Args('id') id: string, @Args('body') body: UpdateUserDto) {
        return this.usersService.updateUser(id, body);
    }


    @Mutation(() => String, {description: "Borra un usuario de manera blanda"})
    softDeleteUSer(@Args('id') id: string){
        return this.usersService.softDeleteUSer(id);
    }


    @Mutation(() => String, {description: "Cancela el borrado blando de un usuario"})
    cancelSoftDelete(@Args('id') id: string){
        return this.usersService.cancelSoftDelete(id)
    }


    @Mutation(() => String, {description: "Borra un usuario de manera permanente"})
    async hardDeleteUser(@Args('id') id: string): Promise<string> {
        return this.usersService.hardDelete(id);
    }

}
