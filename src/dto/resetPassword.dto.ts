/* eslint-disable prettier/prettier */
import { IsEmail,IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from 'class-transformer';


export class ResetPasswordLinkDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase())
    email: string;
  }
  
  export class ResetPasswordDto {
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(8)
    newPassword: string;

    @IsString()
    @ApiProperty()
    token: string;
  }

  
  