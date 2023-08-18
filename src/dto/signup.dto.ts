/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Length,
  Matches,
} from 'class-validator';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastname: string;

  @IsEmail()
  @IsString()
  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @ApiPropertyOptional({
    name: 'role',
    type: 'enums',
  })
  @IsEnum(['individual', 'organization'])
  @IsOptional()
  role?: 'individual' | 'organization';

  @IsNotEmpty()
  @ApiPropertyOptional({
    name: 'company',
    type: 'string',
  })
  @Length(1, 255)
  @IsOptional()
  // @IsEnum(['organization']) // Only required for organization users
  company?: string;

  @IsNotEmpty()
  @ApiPropertyOptional({
    name: 'jobTittle',
    type: 'string',
  })
  @Length(1, 255)
  @IsOptional()
  // @IsEnum(['organization']) // Only required for organization users
  jobTitle?: string;

  @IsString()
  @ApiProperty()
  @Length(6, 20)
  //regex for password to contain at least one uppercase, lowercase, number and special character
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @IsString()
  @ApiPropertyOptional({
    name: 'google',
    type: 'string',
  })
  @IsOptional()
  google?: {
    accessToken: string;
    email: string;
    profileId: string;
  };

  @IsString()
  @ApiPropertyOptional({
    name: 'facebook',
    type: 'string',
  })
  @IsOptional()
  facebook?: {
    accessToken: string;
    email: string;
    profileId: string;
  };
  @IsString()
  @ApiPropertyOptional({
    name: 'avatar',
    type: 'string',
  })
  @IsOptional()
  avatar?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'timestamp',
    name: 'emailVerificationTokenExpiresAt',
    nullable: false,
  })
  public emailVerificationTokenExpiresAt: Date | null = new Date(
    Date.now() + 180 * 1000,
  );

  public dateCreated: Date;

  public dateUpdated: Date;
}
