import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-github2';

import { GitHubLogin } from 'src/app.constant';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: GitHubLogin.GITHUB_CLIENT_ID,
      clientSecret: GitHubLogin.GITHUB_CLIENT_SECRET,
      callbackURL: 'https://app-reviews-server-production.up.railway.app/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.signUpGoogle({
      username: profile.username,
      login: profile.emails[0].value,
      photos: profile.photos[0].value
    });
    return {...profile, roles: user.roles} || null;
  }
}
