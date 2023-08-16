/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateLoginDto {
  @IsEmail()
  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
