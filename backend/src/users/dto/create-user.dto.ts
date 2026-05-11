import { Field, InputType } from '@nestjs/graphql';
import { IsString,  MinLength, MaxLength, IsNotEmpty, IsEnum, IsEmail } from 'class-validator';
import { gender } from '../scripts/types';

@InputType({ description: "El campo username y password son obligatorios proporcionarlos para crear un nuevo usuario"})
export class CreateUserDto {

    @Field()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @Field()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    @IsNotEmpty()
    fullName!: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string;

    @Field()
    @IsEnum(gender)
    gender!: gender;

}
