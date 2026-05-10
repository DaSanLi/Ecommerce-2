import { 
  BadRequestException, 
  Injectable, 
  UnauthorizedException, 
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { IsNull, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/auth-login.dto';
import { UserClass, userResponse, VerificationResponse, ResponseWithCookie, payloadType, RequestWithUser } from './scripts/auth.types';
import { hashPassword, verifyHashPassword } from './scripts/auth.scripts';
import { AuthCookiesService } from './scripts/auth-cookies.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CACHE_KEYS, userCacheOptions } from '../cache/cache.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<userResponse>,
    private readonly jwtService: JwtService,
    private readonly authCookiesService: AuthCookiesService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }


  async loginUser(body: LoginDto, res: ResponseWithCookie): Promise<payloadType> {
    const { email } = body;
    
    const user = await this.userRepository.findOne({ where: { email, deletedAt: IsNull() } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    const passwordVerified = await verifyHashPassword(body.password, user.password);
    
    if (!passwordVerified) {
      throw new BadRequestException('La contraseña ingresada no coincide con la registrada');
    }
    
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);
    
    this.authCookiesService.setTokenCookie(res, token);
    
    return { email, token };
  }


  async registerUser(body: CreateUserDto, res: ResponseWithCookie): Promise<UserClass> {
    const { email } = body;
    
    const existingUser = await this.userRepository.findOne({ where: { email }, withDeleted: true });
    
    if (existingUser) {
      if (existingUser.deletedAt) {
        throw new BadRequestException('Este email pertenece a una cuenta desactivada. Contacta a soporte.');
      }
      throw new BadRequestException('Email en uso, ingresa otro');
    }
    
    const passwordHashed = await hashPassword(body.password);
    
    if (!passwordHashed) {
      this.logger.error('Error hashing password during registration');
      throw new InternalServerErrorException('Ha ocurrido un error en el registro, vuelve a intentarlo');
    }
    
    body.password = passwordHashed;
    
    const newUser = await this.userRepository.save(body);
    
    if (!newUser) {
      this.logger.error('Failed to save new user');
      throw new InternalServerErrorException('No se ha podido registrar al usuario');
    }
    
    const payload = { email: body.email };
    const token = await this.jwtService.signAsync(payload);
    
    this.authCookiesService.setTokenCookie(res, token);
    
    return { email: body.email };
  }

  async findUserByEmail(email: string): Promise<userResponse | null> {
    const cacheKey = CACHE_KEYS.USER_BY_EMAIL(email);
    
    // Intentar obtener del cache
    const cachedUser = await this.cacheManager.get<userResponse>(cacheKey);
    if (cachedUser) {
      this.logger.debug(`Cache hit for user: ${email}`);
      return cachedUser;
    }
    
    const user = await this.userRepository.findOne({ where: { email, deletedAt: IsNull() } });
    
    // Guardar en cache si existe
    if (user) {
      await this.cacheManager.set(cacheKey, user, userCacheOptions.ttl);
    }
    
    return user;
  }

  async verifyAndRefreshToken(cookies: Record<string, string>, res: ResponseWithCookie): Promise<VerificationResponse> {
    const requestWithCookies = {
      cookies,
    } as RequestWithUser;
    
    const payload = await this.authCookiesService.verifyTokenFromCookie(requestWithCookies);

    const user = await this.userRepository.findOne({ where: { email: payload.email, deletedAt: IsNull() } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const newPayload = { email: user.email };
    const newToken = await this.jwtService.signAsync(newPayload);
    this.authCookiesService.setTokenCookie(res, newToken);

    return {
      email: user.email,
      message: 'Verificación exitosa',
    };
  }
}