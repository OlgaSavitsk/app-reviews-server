import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { Public } from 'src/core/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Create token' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignInDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  public signin(
    @Body() user: SignInDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.signin(user, req, res);
  }

  @Public()
  @ApiOperation({ summary: 'Sign up to create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post('signup')
  public signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @Post('signout')
  public signout(@Req() req: Request, @Res() res: Response) {
    return this.authService.signout(req, res);
  }
}
