import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCookiesService } from './scripts/auth-cookies.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './JWT/constants';
import { AuthResolver } from './auth.resolver';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, AuthResolver, AuthGuard, AuthCookiesService],
  controllers: [] as const,
})
export class AuthModule { }
