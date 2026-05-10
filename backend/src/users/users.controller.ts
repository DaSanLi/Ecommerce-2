import { Controller, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    // este endpoint elimina por completo el usuario
    @Delete('/hardDelete/:id')
    hardDeleteUser(@Param('id') id: string) {
        return this.usersService.hardDelete(id);
    }
}
