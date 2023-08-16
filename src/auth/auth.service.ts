/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/signup.dto';
import { Errormessage } from 'src/Errormessage';
import { UserInterface } from '../interface/user.interface';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import moment from 'moment';
import { UsersService } from '../user/user.service';
import { MailService } from '../shared/email/email.service';
import { ForgotPasswordDto } from '../dto/forgotPassword.dto';
import { ForgotPassword } from '../interface/forgotPassword';
import { EmailVerificationDto } from '../dto/emailVerification.dto';
import {
  ResetPasswordLinkDto,
  ResetPasswordDto,
} from '../dto/resetPassword.dto';
import { CreateLoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: MailService,
  ) {}

  async signup(userDto: CreateUserDto): Promise<any> {
    const { email, role } = userDto;
    try {
      // Check if the user already exists
      const existingUser = await this.usersService.findOneByEmail(email);
      if (existingUser) {
        if (existingUser.email === userDto.email) {
          // Email already exists
          if (existingUser.isVerified) {
            throw new ConflictException(Errormessage.UserExist);
          } else {
            // Check if the verification token has expired
            const currentTime = Date.now(); // Convert milliseconds to seconds
            if (
              existingUser.emailVerificationTokenExpiresAt &&
              existingUser.emailVerificationTokenExpiresAt.getTime() <
                currentTime
            ) {
              // The token has expired, delete the previous user account
              await this.usersService.deleteUser(existingUser.id);
            } else {
              throw new ConflictException(Errormessage.UserExist);
            }
          }
        } else {
          throw new ConflictException(Errormessage.UserExist);
        }
      }
      // Hash the password
      const hashPassword = await bcrypt.hash(userDto.password, 10);

      let newUser: User;

      if (role === 'individual') {
        const expirationTime = moment().add(3, 'minutes'); // Calculate expiration time
        newUser = await this.usersService.createOrUpdateUser({
          ...userDto,
          password: hashPassword,
          emailVerificationTokenExpiresAt: expirationTime.toDate(), // 3 minutes from now
          dateCreated: new Date(),
          dateUpdated: new Date(),
        });
      } else if (role === 'organization') {
        const expirationTime = moment().add(3, 'minutes'); // Calculate expiration time
        newUser = await this.usersService.createOrUpdateUser({
          ...userDto,
          password: hashPassword,
          emailVerificationTokenExpiresAt: expirationTime.toDate(), // 3 minutes from now
          dateCreated: new Date(),
          dateUpdated: new Date(),
        });
      }

      // If newUser was not set by role conditions, create a default user
      if (!newUser) {
        newUser = await this.usersService.createOrUpdateUser({
          email,
          password: hashPassword,
          firstname: userDto.firstname,
          lastname: userDto.lastname,
          isVerified: false,
          emailVerificationTokenExpiresAt: new Date(Date.now() + 180 * 1000), // 3 minutes from now
          dateCreated: new Date(),
          dateUpdated: new Date(),
        });
      }

      await this.userModel.save(newUser);

      // Generate a token with the ID
      const payload = {
        id: newUser.id,
        email: newUser.email,
      };
      const options: JwtSignOptions = { expiresIn: '3m' };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const token = await this.jwtService.signAsync(payload, {
        secret,
        ...options,
      });

      // Email the user a unique verification link
      const url = `${process.env.APP_SERVICE_URL}/api/v1/auth/verify/${token}`;
      await this.emailService.sendVerificationEmail(newUser.email, url);

      return {
        success: true,
        isVerified: newUser.isVerified,
        message: `Account successfully created and verification email has been sent to ${newUser.email}`,
      };
    } catch (err) {
      throw err;
    }
  }

  async login(loginDto: CreateLoginDto): Promise<any> {
    const { email, password } = loginDto;
    // Check if email and password are provided
    if (!email || !password) {
      throw new BadRequestException(Errormessage.IncorrectData);
    }
    try {
      console.log('Login request received with email:', email);
      const userExist = await this.userModel.findOne({ where: { email } });
      console.log('User found in database:', userExist);
      if (!userExist) throw new NotFoundException(Errormessage.Userexist);
      // Check if the user is verified
      if (!userExist.isVerified) throw new NotFoundException(Errormessage.Userexist);
      const match = await bcrypt.compare(loginDto.password, userExist.password);
      if (!match) throw new BadRequestException(Errormessage.IncorrectData);
      // Create a token
      const payload = {
        id: userExist.id,
        email: userExist.email,
        isVerified: userExist.isVerified,
        firstname: userExist.firstname,
        lastname: userExist.lastname,
        updatedAt: Date.now(),
        new: true,
      };
      const options: JwtSignOptions = { expiresIn: '7d' };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const token = await this.jwtService.signAsync(payload, {
        secret,
        ...options,
      });

      // User details
      const userInfo = {
        accessToken: token,
        id: userExist.id,
        firstname: userExist.firstname,
        lastname: userExist.lastname,
        email: userExist.email,
        avatar: userExist.avatar,
        google: userExist.google,
        facebook: userExist.facebook,
        isVerified: userExist.isVerified,
        emailVerificationTokenExpiresAt:
          userExist.emailVerificationTokenExpiresAt,
      };
      return {
        responseCode: 200,
        userInfo,
        message: 'Login successfully',
        success: true,
      };
    } catch (err) {
      throw err;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    try {
      const userExist = await this.userModel.findOne({ where: { email } });
      if (!userExist) {
        throw new NotFoundException(Errormessage.Userexist);
      }
      // Generate a token with the ID
      const payload = {
        id: userExist.id,
        email: userExist.email,
      };
      const options: JwtSignOptions = { expiresIn: '3m' };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const token = await this.jwtService.signAsync(payload, {
        secret,
        ...options,
      });
      

      // Email the user a unique forgot password link
      const resetPasswordUrl = `${process.env.APP_SERVICE_URL}/api/resetPassword/${ token }`;
      await this.emailService.sendForgotPasswordEmail(
        userExist.email,
        resetPasswordUrl,
      );

      return {
        responseCode: 200,
        message: `The forgot password link has been sent successfully to ${userExist.email}`,
        success: true,
      };
    } catch (err) {
      throw err;
    }
  }
  async emailVerification(
    emailVerificationDto: EmailVerificationDto,
  ): Promise<any> {
    const { token } = emailVerificationDto;
    try {
      const secret = process.env.ACCESS_TOKEN_SECRET;
      
      const payload = await this.jwtService.verifyAsync(token, { secret });
      console.log('The payload is:', payload);
      const userExist = await this.usersService.findById(payload.id);
      if (!userExist) {
        throw new NotFoundException(Errormessage.Userexist);
      }

      if (userExist.isVerified) {
        throw new ConflictException(Errormessage.UserExist);
      }

      // Check if the verification token has expired
      const currentTime = Date.now();
      const tokenExpirationTime =
        userExist.emailVerificationTokenExpiresAt?.getTime() || 0;

      if (tokenExpirationTime < currentTime) {
        throw new UnauthorizedException(Errormessage.InvalidToken);
      }

      // Update user verification status to true
      userExist.isVerified = true;
      await this.userModel.save(userExist);

      // Redirect user to the frontend login page
      // return redirect(`${process.env.}`);

      // User details
      const userInfo = {
        verified: userExist.isVerified,
        firstname: userExist.firstname,
        lastname: userExist.lastname,
      };

      return {
        responseCode: 200,
        message: 'The account has been verified successfully.',
        userInfo,
        success: true,
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        return { success: false, error: 'User not found' };
      }
      if (err instanceof ConflictException) {
        return { success: false, error: 'User already verified' };
      }
      if (err instanceof UnauthorizedException) {
        return { success: false, error: 'Invalid or expired token' };
      }
      return { success: false, error: 'An error occurred during email verification' };
    }
  }

  async resetPasswordLink(
    resetPasswordLinkDto: ResetPasswordLinkDto,
  ): Promise<any> {
    const { email } = resetPasswordLinkDto;
    try {
      const userExist = await this.usersService.findOneByEmail(email);
      if (!userExist) {
        throw new NotFoundException(Errormessage.IncorrectEmail);
      }

      // Generate a token with the ID
      const payload = {
        id: userExist.id,
        email: userExist.email,
      };

      const options: JwtSignOptions = { expiresIn: '3m' };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const token = await this.jwtService.signAsync(payload, {
        secret,
        ...options,
      });

      // Email the user a unique reset password link
      const resetPasswordUrl = `${process.env.APP_SERVICE_URL}/api/resetPassword/${token}`;
      await this.emailService.sendResetPasswordEmail(
        userExist.email,
        resetPasswordUrl,
      );

      const userInfo = {
        resetPasswordUrl,
      };

      return {
        responseCode: 200,
        userInfo,

        message: `Reset password successfully sent to ${userExist.email}`,
        success: true,
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        // Handle not found exception (user not found)
        return { success: false, error: 'User not found' };
      }
      // Handle other exceptions, such as token expiration or invalid token
      return { success: false, error: 'Invalid or expired token' };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, newPassword } = resetPasswordDto;
    try {
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const payload = await this.jwtService.verifyAsync(token, { secret });

      const userExist = await this.usersService.findById(payload.id);
      if (!userExist) {
        throw new NotFoundException(Errormessage.Userexist);
      }

      // Check if the provided password matches the user's current password
      const isMatch = await bcrypt.compare(newPassword, userExist.password);
      if (isMatch) {
        throw new BadRequestException(Errormessage.IncorrectData);
      } else {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        userExist.password = hashedPassword;
      }

      // Save the changes to the user document
      await this.userModel.save(userExist);

      return {
        responseCode: 200,
        message: 'Password reset successful',
        success: true,
      };
    } catch (err) {
      throw err;
    }
  }
}
