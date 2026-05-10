import { Column, Entity, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Task } from '../../task/entities/task.entity'
import { gender } from "../scripts/types";

@Entity()
@ObjectType({ description: "Representa un usuario y sus credenciales" })
export class User {

    @PrimaryGeneratedColumn( 'increment' )
    @Field(() => ID, { description: "Identificador unico de usuario" })
    id!: string 

    @Column({ type: "varchar", length: 50, unique: true, nullable: false })
    @Field(() => String, { description: "Nombre de usuario"})
    email!: string;

    @Column({ type: "varchar", nullable: false })
    @Field(() => String, {description: "Contraseña de usuario"})
    password!: string;

    @Column({ type: "varchar"})
    @Field(() => String, {description: "Nombre completo del usuario"})
    fullName!: string;

    @Column({ type: "varchar", nullable: false })
    @Field(() => String, {description: "Género"})
    gender!: gender;

    @DeleteDateColumn()
    @Field(() => Date, { nullable: true, description: "Muestra si el usuario ha sido borrado" })
    deletedAt?: Date|null;

    @OneToMany(() => Task, (task) => task.user, { eager: true })
    //si por seguridad no se quisiera que los usuarios vieran tasks ajenas de otros usuarios 
    // se comentará la siguiente linea de codigo obligando a cada usuario a resguardar sus tareas 
    //sin que nadie pueda verlas a menos que realice un login y se envie un token en cada petición a todas las
    //rutas relacionados con la entidad Task.
    @Field(() => [Task], { nullable: true, description: "Muestra todas las tasks de todos los usuarios creados y sus campos" })
    tasks?: Task[];
}
