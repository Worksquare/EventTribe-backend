/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../user/user.service';


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly usersService: UsersService,
     configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      scope: 'email', 
      profileFields: ['emails', 'name'],
      // passReqToCallback: true,
    });
  }

  async validate(
    req: any, // Assuming you're passing 'req' to the validate function
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    console.log('Received accessToken:', accessToken);
    console.log('Received refreshToken:', refreshToken);
    console.log('Received profile:', profile);
    const { id, name, emails, photos } = profile
    try {
      const email = profile['_json']['email'];
      if (!email) {
        new Error('Failed to receive email from Facebook. Please try again :(')
      }

      let user = await this.usersService.findOneByEmail(email);

      if (user) {
        // Update the user's avatar if it exists in the profile
        if (photos && photos.length > 0) {
          user.avatar = photos[0].value;
          await user.save();
        }
        return done(null, user);
      }

      // Create a new user
      user = await this.usersService.createOrUpdateUser({
        firstname: profile.displayName,
        lastname: profile.displayName,
        email,
        avatar: photos && photos.length > 0 ? photos[0].value : null,
        facebook: {
          accessToken,
          email,
          profileId: profile.id
        },
        password: '',
        isVerified: false,
        emailVerificationTokenExpiresAt: undefined,
        dateCreated: undefined,
        dateUpdated: undefined
      });

      const userInfo = {
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
      done(null, payload);
    } catch (error) {
      throw error
    }
  }
}