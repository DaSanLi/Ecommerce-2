import { UpdateResult } from "typeorm";
import { User } from "../entities/user.entity"
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';


//funciones que generan excepciones
const BadRequestFunction = (mensaje: string): never => {
    throw new BadRequestException(mensaje)
}

const InternalExpectionFunction = (mensaje: string): never => {
    throw new InternalServerErrorException(mensaje)
}

export { BadRequestFunction, InternalExpectionFunction }