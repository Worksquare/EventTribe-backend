/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationDto {
  @IsString()
  @ApiProperty()
  token: string;
}
