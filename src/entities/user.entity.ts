/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ nullable: false, type: 'text' })
  firstname: string;

  @IsString()
  @Column({ nullable: false, type: 'text' })
  lastname: string;

  @IsString()
  @Column({ nullable: false, unique: true, type: 'text' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @Column({ nullable: false, type: 'text' })
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['individual', 'organization'])
  role: 'individual' | 'organization';

  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  @IsEnum(['organization'])
  @IsOptional()
  company?: string; // Optional for organization

  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  @IsOptional()
  @IsEnum(['organization'])
  jobTitle?: string; // Optional for organization

  @IsString()
  @Column({ nullable: true })
  @IsOptional()
  avatar?: string;

  @IsString()
  @Column({ type: 'json', nullable: true }) // Using JSON type for embedded objects
  @IsOptional()
  google?: {
    accessToken: string;
    email: string;
    profileId: string;
  };

  @IsString()
  @Column({ type: 'json', nullable: true }) // Using JSON type for embedded objects
  @IsOptional()
  facebook?: {
    accessToken: string;
    email: string;
    profileId: string;
  };

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

  profile: any;
}
