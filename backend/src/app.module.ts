import { Module, DynamicModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database-connection/database.module';
import { GraphQlModule } from './graph-ql/graph-ql.module';
import { AuthModule } from './auth/auth.module'; 
import { UsersModule } from './users/users.module';
import { TaskModule } from './task/task.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: ([
    CacheModule.register({
      isGlobal: true,
      ttl: parseInt(process.env.CACHE_TTL || '300000'),
      max: parseInt(process.env.CACHE_MAX_ITEMS || '1000'),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: parseInt(process.env.THROTTLE_TTL || '60000'),
          limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
        },
      ],
    }),
    DatabaseModule, 
    GraphQlModule,
    UsersModule,
    AuthModule,
    TaskModule,
  ] as DynamicModule[]),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}