/* eslint-disable prettier/prettier */
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Put,
  Headers,
  Get,
  Param,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Res,
  Delete,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from '../dto/signup.dto';

@Controller('/api/v1/users')
@ApiTags('api/v1/auth')
export class UserController {
  UserService: any;
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'User successfully created',
  })
  @ApiBadRequestResponse({
    description: 'User with the email and already exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createOrUpdateUser(@Body() createDto: CreateUserDto): Promise<any> {
    return this.usersService.createOrUpdateUser(createDto);
  }

  @Get('/getUsers')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Users successfully fetched' })
  @ApiBadRequestResponse({
    description: 'User with the email and already exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/getUser/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Users successfully fetched' })
  @ApiBadRequestResponse({ description: 'User with the id does not exists.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // @Get('/getUser/:id')
  // findOneById(@Param('id') id: string) {
  //   return this.usersService.findOneById(id);
  // }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Users successfully deleted' })
  @ApiBadRequestResponse({
    description: 'User with the email does not exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
