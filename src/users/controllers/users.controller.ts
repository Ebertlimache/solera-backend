import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FullNameDto } from '../dtos/fullname.dto';
import { UserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Gets the fullname of a user found by username and password',
  })
  @ApiResponse({ status: 200, description: 'User exists.' })
  @ApiResponse({ status: 404, description: 'User does not exist.' })
  @Post('findByUsernameAndPassword')
  async findByUsernameAndPassword(@Body() userDto: UserDto) {
    const fullnameUser = await this.usersService.getFullName(
      userDto.username,
      userDto.password,
    );
    if (!fullnameUser) {
      throw new NotFoundException();
    }
    return fullnameUser;
  }
}
