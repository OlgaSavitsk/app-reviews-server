import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/models/users.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: any) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: any) {
    const user = await this.authService.checkUser(payload.login);
    return payload ? done(null, payload) : done(null, null);
  }
}
