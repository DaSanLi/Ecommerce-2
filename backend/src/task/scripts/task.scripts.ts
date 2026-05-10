import { UpdateResult } from "typeorm";
import { User } from "../../users/entities/user.entity"
import { Task } from "../entities/task.entity"
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

//funciones que generan excepciones
const BadRequestFunction = (mensaje: string): never => {
    throw new BadRequestException(mensaje)
}

const InternalExpectionFunction = (mensaje: string): never => {
    throw new InternalServerErrorException(mensaje)
}

const UnauthorizedFunction = (mensaje: string): never => {
    throw new UnauthorizedException(mensaje)
}

export { BadRequestFunction, InternalExpectionFunction, UnauthorizedFunction }