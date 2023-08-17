/* eslint-disable prettier/prettier */
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = { sub: string; email: string };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: { cookies: { jwt: any; }; }) => {
          // Extract JWT token from the 'jwt' cookie
          if (req && req.cookies) {
            return req.cookies.jwt;
          }
          return null;
        },
      ]),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false, // Ensure token expiration is checked
    });
  }

  async validate(payload: JwtPayload) {
    // Checking if the user exists in the database
    // If the validation fails, throw an UnauthorizedException
    return { id: payload.sub, email: payload.email };
  }
}
