import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'username123',
    description: 'User Name',
  })
  @IsString()
  readonly username: string;

  @ApiProperty({
    example: 'password1234',
    description: 'Password',
  })
  @IsString()
  readonly password: string;
}
