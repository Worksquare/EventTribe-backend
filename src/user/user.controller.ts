import {
    Body,
    Controller,
    Post,
    Put,
    Headers,
    Get,
    Param,
    UploadedFile,
    UseInterceptors,
    Res,
    Delete,
    Patch,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/user.dto';
  import { CreateLoginDto } from './dto/login.dto';

  @Controller('')
  export class UserController {
    constructor(private service: UserService) {} 

    @Post('/signup')
    signUp(@Body() createDto: CreateUserDto): Promise<any> {
        return this.service.createAccount(createDto);
    }

    @Post('/login')
    login(@Body() loginDto: CreateLoginDto): Promise<any> {
        return this.service.login(loginDto);
    }
}