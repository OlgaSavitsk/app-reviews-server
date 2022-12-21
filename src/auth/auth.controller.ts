import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import * as passport from 'passport';

import { CLIENT_URL } from 'src/app.constant';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { AuthenticatedGuard, GithubAuthGuard } from './guards/github.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create token' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  public signin(@Body() user: SignInDto, @Req() req: Request, @Res() res: Response) {
    return this.authService.signin(user, req, res);
  }

  @ApiOperation({ summary: 'Sign up to create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post('signup')
  public signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('user-profile')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  public getUserProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('logout')
  public signout(@Res() res: Response) {
    return this.authService.signout(res);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  handleLogin(@Body() body: any) {
    return { msg: 'Google Auth' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  handleRedirect(@Res() res: Response) {
    passport.authenticate('google', { successRedirect: CLIENT_URL });
    res.redirect(CLIENT_URL);
  }

  @UseGuards(GithubAuthGuard)
  @Get('github')
  handleLoginGithub() {
    return { msg: 'Github Auth' };
  }

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  handleRedirectGithub(@Res() res: Response) {
    // passport.authenticate('github', { successRedirect: CLIENT_URL });
    res.redirect(CLIENT_URL);
  }
}
