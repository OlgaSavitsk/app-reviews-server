import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';

import { GoogleLogin } from 'src/app.constant';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: GoogleLogin.GOOGLE_CLIENT_ID,
      clientSecret: GoogleLogin.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.signUpGoogle({
      username: profile.displayName,
      login: profile.emails[0].value,
      photos: profile.photos[0].value
    });
    return { ...profile, username: profile.displayName } || null;
  }
}
