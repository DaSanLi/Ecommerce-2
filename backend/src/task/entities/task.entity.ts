import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn, JoinColumn } from "typeorm";
import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity'
import { priorityState, taskStatus } from "../scripts/task.types";

@Entity()
@ObjectType({ description: "Resprenta una tarea del usuario y solo podran acceder usuarios con tokens validos" })
export class Task {

        @PrimaryGeneratedColumn( 'increment' )
        @Field( () => ID, {description: "Identificador unico de la entidad"} )
        id!: string; 

        @ManyToOne(() => User, (user) => user.tasks,{onDelete: 'CASCADE'})
        @JoinColumn({ name: 'userId' })
        user!: User;

        @Column({ type: 'varchar' })
        @Field( () => String, {description: "Titulo de la tarea"})
        title!: string;

        @Column()
        @Field({ description: "Prioridad de la tarea (baja, media, alta o urgente)"})
        priority!: priorityState;

        @Column({ type: 'varchar' })
        @Field( () => String, { description: "Descripción referente a la tarea" } )
        description!: string;

        @Column({ type: 'varchar', default: 'pendiente' })
        @Field(() => String, { description: "Estado de la tarea en el tablero Kanban" })
        status: taskStatus = taskStatus.pendiente;

        @Column({ type: 'int', default: 0 })
        @Field(() => Int, { description: "Orden de la tarea dentro de su estado" })
        orderInStatus: number = 0;

        @DeleteDateColumn()
        deletedAt?: Date|null;
}
