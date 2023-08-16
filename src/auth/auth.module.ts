/* eslint-disable prettier/prettier */
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UserModule } from '../user/user.module';
import { MailService } from '../shared/email/email.service';
import { JwtAuthService } from './social/jwt-auth.service';
import { FacebookStrategy } from './social/facebook/facebook-oauth.service';
import { GoogleStrategy } from './social/google/google-oauth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'Gmail',
          host: configService.get<string>('CONTACT_HOST'),
          port: configService.get<number>('SEND_MAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          tls: {
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.3',
          },
          ciphers: 'TLS_AES_128_GCM_SHA256',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FacebookStrategy,
    GoogleStrategy,
    MailService,
    JwtAuthService,
  ],
  exports: [AuthService, MailService, JwtAuthService],
})
export class AuthModule {}
