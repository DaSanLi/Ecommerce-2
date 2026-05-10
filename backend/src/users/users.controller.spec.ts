import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            hardDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hardDeleteUser', () => {
    it('debería eliminar un usuario permanentemente', async () => {
      const mockResponse = 'Usuario borrado satisfactoriamente';
      jest.spyOn(service, 'hardDelete').mockResolvedValue(mockResponse);

      const result = await controller.hardDeleteUser('1');

      expect(result).toBe(mockResponse);
      expect(service.hardDelete).toHaveBeenCalledWith('1');
    });

    it('debería manejar errores al eliminar usuario', async () => {
      jest.spyOn(service, 'hardDelete').mockResolvedValue('Usuario no encontrado');

      const result = await controller.hardDeleteUser('999');

      expect(result).toBe('Usuario no encontrado');
      expect(service.hardDelete).toHaveBeenCalledWith('999');
    });
  });
});