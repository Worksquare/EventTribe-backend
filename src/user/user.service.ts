import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
  import { DataSource, Repository } from 'typeorm';
  import { User } from './entities/user.entity';
  import { CreateUserDto } from './dto/user.dto';
  import { validateEmail } from '../../helpers/config';
  import { Errormessage } from 'src/Errormessage';
  const bcrypt = require('bcrypt');
  import  * as jwt from 'jsonwebtoken'
import { CreateLoginDto } from './dto/login.dto';


  @Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    ) {}


    async createAccount(userDto: CreateUserDto): Promise<any> {
        try {
            const isValidEmail = validateEmail(userDto.email);
            if (!isValidEmail)
              return new NotFoundException(Errormessage.IncorrectEmail);
            const userExist = await this.userModel.findOneBy({
              email: userDto.email.toLowerCase(),
            });
          if(!userExist) {
            if(userDto.password.length < 9) throw new NotFoundException(Errormessage.Passwordlength)
            if(userDto.password == userDto.confirmPassword) {
              const user = await this.userModel.create({
                email: userDto.email.toLowerCase(),
                password: userDto.password,
                firstname: userDto.firstname,
                lastname: userDto.lastname,
                dateCreated: new Date(Date.now()),
                dateUpdated: new Date(Date.now()),
              });
              const saltRounds = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(user.password, saltRounds);
              user.password = hashPassword;
              const newUser = await this.userModel.save(user);
              return {
                responseCode: 201,
                success: true,
                message:
                  'Account successfully created ',
              };
             }
             throw new NotFoundException(Errormessage.Unmatchpassword);
          }
          throw new NotFoundException(Errormessage.UserExist);
        } catch (err) {
          throw err;
        }
      }

      async login(loginDto: CreateLoginDto): Promise<any> {
        try {
          const userExist = await this.userModel.findOneBy({
            email: loginDto.email.toLowerCase(),
          });
          if (!userExist) throw new NotFoundException(Errormessage.IncorrectData);
          const match = await bcrypt.compare(loginDto.password, userExist.password);
          if (!match) throw new NotFoundException(Errormessage.IncorrectData);
          // Create a token
          const payload = {
            id: userExist.id,
            phone: userExist.email,
          };
          const options = { expiresIn: '7d' };
          const secret = process.env.JWT_SECRET;
          const token = jwt.sign(payload, secret, options);
          return {
            responseCode: 200,
            success: true,
            accessToken: token,
            firstname: userExist.firstname,
            email: userExist.email,
            lastname: userExist.lastname,
          };
        } catch (err) {
          throw err;
        }
      }
    
  }