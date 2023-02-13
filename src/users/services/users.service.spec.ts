import { Test, TestingModule } from '@nestjs/testing';
import { FullNameDto } from '../dtos/fullname.dto';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

const fullName: FullNameDto = {
  fullname: 'juan pelis',
};

const joseLopezData: { password: string; fullname: string } = {
  password: '$2b$12$xzEe0IDljX.DY8Le59vIBO91ZJ70larVTh7WGzybtqY35.c7QDWY6',
  fullname: 'Jose Lopez',
};

const juanPerezData: { password: string; fullname: string } = {
  password: '$2b$12$YqkAg2.V1np060jXjQv.t.b0llzup.7afFfC2OxU7Rqgw5/kiWipO',
  fullname: 'Juan Perez',
};

const adminHashPassword: string =
  '$2b$12$YqkAg2.V1np060jXjQv.t.b0llzup.7afFfC2OxU7Rqgw5/kiWipO';

const mockedUserRepository = {
  findOne(query: any) {
    return {
      ...fullName,
      password: '$2b$12$YqkAg2.V1np060jXjQv.t.b0llzup.7afFfC2OxU7Rqgw5/kiWipO',
    };
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFullName', () => {
    it('should return the string Juan Perez', async () => {
      jest
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(() => juanPerezData);
      expect(await service.getFullName('admin', 'admin')).toStrictEqual({
        fullname: 'Juan Perez',
      });
    });

    it('should return the string Jose Lopez', async () => {
      jest
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(() => joseLopezData);
      expect(await service.getFullName('admin2', 'admin2')).toStrictEqual({
        fullname: 'Jose Lopez',
      });
    });

    it('should return false because no results for findOne', async () => {
      jest
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(() => null);
      expect(await service.getFullName('admin3', 'admin2')).toStrictEqual(
        false,
      );
    });

    it('should return false because does not satisfy the passwordValidator', async () => {
      jest
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(() => juanPerezData);
      expect(await service.getFullName('admin', 'whatever')).toStrictEqual(
        false,
      );
    });
  });

  describe('passwordValidator', () => {
    it('should return the boolean True because the validation is correct ', async () => {
      expect(
        await service.passwordValidator('admin', adminHashPassword),
      ).toStrictEqual(true);
    });

    it('should return the boolean False because it does not satisfy the validation', async () => {
      expect(
        await service.passwordValidator('admin', 'whatever'),
      ).toStrictEqual(false);
    });
  });
});
