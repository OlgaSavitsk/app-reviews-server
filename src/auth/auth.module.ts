import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './strategies/serialize';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    GithubStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'secret123123',
    }),
    UsersModule,
    PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule { }
