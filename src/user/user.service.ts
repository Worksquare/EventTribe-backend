/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import {InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import {CreateUserDto} from '../dto/signup.dto'
import {User} from '../entities/user.entity'
import * as bcrypt from 'bcrypt';
import { Errormessage } from '@/Errormessage';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createOrUpdateUser(userDto: CreateUserDto, userId?: string): Promise<User> {
    const { firstname, lastname, email, password, role, company, jobTitle } = userDto;
  
    if (userId) {
      const userExist = await this.userRepository.findOne({ where: { id: userId } });
      if (!userExist) {
        throw new NotFoundException(Errormessage.Userexist);
      }
  
      // Update user properties based on updateUserDto
      if (firstname) {
        userExist.firstname = firstname;
      }
      if (lastname) {
        userExist.lastname = lastname;
      }
      if (email) {
        userExist.email = email;
      }
      if (password) {
        const hashPassword = await bcrypt.hash(password, 10);
        userExist.password = hashPassword;
      }
      if (role) {
        // You might need to handle role changes based on your application logic
        userExist.role = role  // Make sure UserRole is a valid enum
      }
      if (company) {
        // Only update company for organization users
        if (userExist.role === 'organization') {
          userExist.company = company;
        } else {
          throw new BadRequestException(Errormessage.UnauthorisedOperation);
        }
      }
      if (jobTitle) {
        // Only update jobTitle for organization users
        if (userExist.role === 'organization') {
          userExist.jobTitle = jobTitle;
        } else {
          throw new BadRequestException(Errormessage.UnauthorisedOperation);
        }
      }
  
      return this.userRepository.save(userExist);
    } else {
      // Creating a new user
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException(Errormessage.UserExist);
      }
  
      const newUser = this.userRepository.create({
        firstname,
        lastname,
        email,
        password,
        role,
        company,
        jobTitle,
      });
  
      return this.userRepository.save(newUser);
    }
  }
  
  

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({where: {email: email}});
  }


  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
  async findById(userId: string): Promise<User | undefined> {
    return this.userRepository.findOne({where: { id: userId}});
  }

  

async deleteUser(userId: string): Promise<void> {
  const user = await this.userRepository.findOne({where: { id : userId}});

  if (user) {
    await this.userRepository.remove(user);
  }
}

  }

  