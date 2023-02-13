import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FullNameDto } from '../dtos/fullname.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getFullName(
    username: string,
    password: string,
  ): Promise<FullNameDto | boolean> {
    const result: { password: string; fullname: string } =
      await this.userRepository.findOne({
        select: ['password', 'fullname'],
        where: { username },
        cache: true,
      });
    if (!result) {
      return false;
    }

    const isValidatePassword = await this.passwordValidator(
      password,
      result.password,
    );
    if (!isValidatePassword) {
      return false;
    }

    return { fullname: result.fullname };
  }

  async passwordValidator(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashPassword);
    if (!isMatch) {
      return false;
    }
    return true;
  }
}
