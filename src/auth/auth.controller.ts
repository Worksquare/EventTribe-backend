/* eslint-disable prettier/prettier */
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  Res,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../dto/signup.dto';
import { CreateLoginDto } from '../dto/login.dto';
import { Request, Response } from 'express';
import {
  ResetPasswordLinkDto,
  ResetPasswordDto,
} from '../dto/resetPassword.dto';
import { ForgotPasswordDto } from '../dto/forgotPassword.dto';
import { EmailVerificationDto } from '../dto/emailVerification.dto';
import { JwtAuthService } from './social/jwt-auth.service';

@Controller('api/v1/auth')
@ApiTags('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtAuthService: JwtAuthService,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'Successfully created user',
  })
  @ApiBadRequestResponse({
    description: 'User with that email already exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async signup(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.signup(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CreateUserDto, description: 'Login successfully' })
  @ApiBadRequestResponse({
    description: 'User with the email and password already exists.',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async login(@Body() createLoginDto: CreateLoginDto): Promise<string> {
    return this.authService.login(createLoginDto);
  }

  @Post('/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResetPasswordDto,
    description: 'Reset password is successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid password or token.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('/resetLink')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResetPasswordDto,
    description: 'Reset password successfully sent',
  })
  @ApiBadRequestResponse({ description: 'Invalid email.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async resetPasswordLink(
    @Body() resetPasswordLinkDto: ResetPasswordLinkDto,
  ): Promise<string> {
    return this.authService.resetPasswordLink(resetPasswordLinkDto);
  }

  @Post('/forgot')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResetPasswordDto,
    description: 'Reset password successfully sent',
  })
  @ApiBadRequestResponse({ description: 'Invalid email.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<string> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('/verify/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResetPasswordDto,
    description: 'The account has been verified successfully.',
  })
  @ApiBadRequestResponse({ description: 'Invalid token.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async emailVerification(
    @Body() emailVerificationDto: EmailVerificationDto,
  ): Promise<string> {
    return this.authService.emailVerification(emailVerificationDto);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @Req() req: Request,
    res: Response,
  ): Promise<any> {
    const { accessToken } = await this.jwtAuthService.login(req.user.toString());
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get()
  @UseGuards(AuthGuard('/google'))
  async googleAuth(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const { accessToken } = await this.jwtAuthService.login(req.user.toString());
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
