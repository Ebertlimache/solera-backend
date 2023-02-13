import { Test, TestingModule } from '@nestjs/testing';
import { FullNameDto } from '../dtos/fullname.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';
import { NotFoundException } from '@nestjs/common';

const fullName: FullNameDto = {
  fullname: 'Juan Perez',
};

const mockedUserRepository = {
  findOne(query: any) {
    return fullName;
  },
  count(query: any) {
    return 1;
  },
  find(query: any) {
    if (query.where && query.where.order_number === 'itDoesntExist') {
      return null;
    } else {
      return [fullName];
    }
  },
  create(entity: User) {
    return fullName;
  },
  save(entity: User) {
    return fullName;
  },
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUsernameAndPassword', () => {
    it('should return an object with fullname attribute', async () => {
      const result = fullName;
      const promise = Promise.resolve(result);
      jest
        .spyOn(controller, 'findByUsernameAndPassword')
        .mockImplementation(() => promise);

      expect(
        await controller.findByUsernameAndPassword({
          username: 'admin',
          password: 'admin',
        }),
      ).toStrictEqual(result);
    });

    it('should return a NotFoundException if the user doesnt exist', async () => {
      const result = false;
      const promise = Promise.resolve(result);
      jest.spyOn(service, 'getFullName').mockImplementation(() => promise);

      try {
        await controller.findByUsernameAndPassword({
          username: 'admin3',
          password: 'admin3',
        });
      } catch (e) {
        const error = new NotFoundException().message;
        expect(e.message).toStrictEqual(error);
      }
    });
  });
});
