/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-auth.strategy';
import { UsersService } from '../../user/user.service';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
    ) {}

  generateJwtPayload(user) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return payload;
  }

  async login(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    const payload: JwtPayload  = this.generateJwtPayload(user);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

}
