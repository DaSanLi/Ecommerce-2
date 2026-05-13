import { Task } from "../../task/entities/task.entity";
import { User } from "../../users/entities/user.entity";

export default () => ({
    database: {
        type: 'postgres' as const,
        port: Number(process.env.DB_PORT),
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, Task],
        migrations: ['dist/database-connection/database/migrations/*.js'],
        synchronize: false,
    }
});