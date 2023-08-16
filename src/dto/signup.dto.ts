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
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsEnum(['individual', 'organization'])
  @IsOptional()
  role?: 'individual' | 'organization';

  @IsNotEmpty()
  @ApiProperty()
  @Length(1, 255)
  @IsOptional()
  // @IsEnum(['organization']) // Only required for organization users
  company?: string;

  @IsNotEmpty()
  @ApiProperty()
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
  @ApiProperty()
  @IsOptional()
  google?: {
    accessToken: string;
    email: string;
    profileId: string;
  };

  @IsString()
  @ApiProperty()
  @IsOptional()
  facebook?: {
    accessToken: string;
    email: string;
    profileId: string;
  };
  @IsString()
  @ApiProperty()
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
