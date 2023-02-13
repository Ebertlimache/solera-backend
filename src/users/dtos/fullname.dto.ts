import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FullNameDto {
  @ApiProperty({
    example: 'Juan Perez',
    description: 'Full Name',
  })
  @IsString()
  readonly fullname: string;
}

