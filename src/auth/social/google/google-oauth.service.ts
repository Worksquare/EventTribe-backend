/* eslint-disable prettier/prettier */
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('Received accessToken:', accessToken);
  console.log('Received refreshToken:', refreshToken);
  console.log('Received profile:', profile);
    const { name, emails, photos } = profile;

    try {
      const email = profile['_json']['email'];
      if (!email) {
        return done(
          new Error('Failed to receive email from Google. Please try again :(')
        );
      }

      let user = await this.usersService.findOneByEmail( email );

      if (user) {
        // Update the user's profileAvatar if it exists in the profile
        if (profile.photos && profile.photos.length > 0) {
          user.avatar = profile.photos[0].value;
          await user.save();
        }
        return done(null, user);
      }

      // Create a new user
      user = await this.usersService.createOrUpdateUser({
        firstname: profile.displayName,
        lastname: profile.displayName,
        email,
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        google: {
          accessToken,
          profileId: profile.id,
          email,
        },
        password: '',
        isVerified: false,
        emailVerificationTokenExpiresAt: undefined,
        dateCreated: undefined,
        dateUpdated: undefined
      });

      const userInfo = {
        profileId: profile.id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        avatar: photos[0].value,
        accessToken,
      };

      const payload = {
        user: userInfo,
        accessToken,
      };
      return done(null, payload);
    } catch (error) {
      throw error
    }
  }
}
