import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthCookiesService } from './scripts/auth-cookies.service';
import { User } from '../users/entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { gender } from '../users/scripts/types';

// Mock completo de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('$2a$10$mockhash')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let jwtService: any;
  let authCookiesService: any;

  const mockUser = {
    id: '1',
    email: 'test@test.com',
    password: '$2a$10$hashedpassword',
    fullName: 'Test User',
    gender: gender.male,
    deletedAt: null,
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: AuthCookiesService,
          useValue: {
            verifyTokenFromCookie: jest.fn(),
            setTokenCookie: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    authCookiesService = module.get<AuthCookiesService>(AuthCookiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('debería iniciar sesión correctamente', async () => {
      const loginDto = { email: 'test@test.com', password: 'password123' };

      userRepository.findOne.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('mock-token');

      const result = await service.loginUser(loginDto, mockResponse as any);

      expect(result).toEqual({ email: 'test@test.com', token: 'mock-token' });
      expect(authCookiesService.setTokenCookie).toHaveBeenCalledWith(mockResponse, 'mock-token');
    });

    it('debería fallar si el usuario no existe', async () => {
      const loginDto = { email: 'noexiste@test.com', password: 'password123' };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.loginUser(loginDto, mockResponse as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería fallar si la contraseña es incorrecta', async () => {
      const bcrypt = require('bcrypt');
      const loginDto = { email: 'test@test.com', password: 'wrongpassword' };
      
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(false));
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.loginUser(loginDto, mockResponse as any)).rejects.toThrow();
    });
  });

  describe('registerUser', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      const createUserDto = {
        email: 'new@test.com',
        password: 'password123',
        fullName: 'New User',
        gender: gender.male,
      };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({ ...createUserDto, id: '2' });
      jwtService.signAsync.mockResolvedValue('mock-token');

      const result = await service.registerUser(createUserDto, mockResponse as any);

      expect(result).toEqual({ email: 'new@test.com' });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('debería fallar si el email ya está en uso', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Test User',
        gender: gender.male,
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.registerUser(createUserDto, mockResponse as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería fallar si el email pertenece a una cuenta desactivada', async () => {
      const createUserDto = {
        email: 'deleted@test.com',
        password: 'password123',
        fullName: 'Deleted User',
        gender: gender.male,
      };

      const deletedUser = { ...mockUser, email: 'deleted@test.com', deletedAt: new Date() };

      userRepository.findOne.mockResolvedValue(deletedUser);

      await expect(service.registerUser(createUserDto, mockResponse as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUserByEmail', () => {
    it('debería encontrar un usuario por email', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('test@test.com');

      expect(result).toEqual(mockUser);
    });

    it('debería retornar null si el usuario no existe', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserByEmail('noexiste@test.com');

      expect(result).toBeNull();
    });
  });

  describe('verifyAndRefreshToken', () => {
    it('debería verificar y refrescar el token', async () => {
      const cookies = { token: 'valid-token' };

      authCookiesService.verifyTokenFromCookie.mockResolvedValue({ email: 'test@test.com' });
      userRepository.findOne.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('new-token');

      const result = await service.verifyAndRefreshToken(cookies, mockResponse as any);

      expect(result).toEqual({ email: 'test@test.com', message: 'Verificación exitosa' });
      expect(authCookiesService.setTokenCookie).toHaveBeenCalledWith(mockResponse, 'new-token');
    });

    it('debería fallar si el usuario no existe', async () => {
      const cookies = { token: 'valid-token' };

      authCookiesService.verifyTokenFromCookie.mockResolvedValue({ email: 'noexiste@test.com' });
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.verifyAndRefreshToken(cookies, mockResponse as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});