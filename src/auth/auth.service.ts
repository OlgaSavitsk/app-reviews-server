import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SignInDto } from './dto/signin-dto';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entity/user.entity';
import { Token } from './models/token.model';
import { ExceptionsMessage, IsBlockedStatus } from 'src/app.constant';
import { Response, Request } from 'express';
import { Role } from 'src/roles/entity/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, +process.env.CRYPT_SALT);
  }

  getToken(userId: string, name: string, roles: Role[]): Token {
    const accessToken = this.jwtService.sign({
      username: name,
      sub: userId,
      roles: roles,
    });
    return {
      access_token: accessToken,
    };
  }

  async signup(userDto: CreateUserDto) {
    await this.checkUserInBd(userDto.login);
    const date = String(Date.now());
    const passwordHash = await this.hashData(userDto.password);
    const newUser = await this.userService.createUser({
      ...userDto,
      password: passwordHash,
      createdAt: date,
      updatedAt: date,
      status: IsBlockedStatus.ACTIVE_STATUS,
    });
    await this.checkUser(newUser.name);
    return newUser;
  }

  async signin(dto: SignInDto, req: Request, res: Response) {
    const user = await this.checkUser(dto.username);
    console.log('userName555', user);
    // await this.checkPassword(password, user.password);
    // await this.userService.createUser({
    //   ...user,
    //   updatedAt: String(Date.now()),
    //   roles: req.user.roles,
    // });
    const { access_token } = await this.getToken(
      user.id,
      dto.username,
      user.roles,
    );
    if (!access_token) {
      throw new ForbiddenException();
    }
    res.cookie('token', access_token);
    return res.send({ message: 'Logged successfully' });
  }

  signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  async checkUser(login: string) {
    const user = await this.userRepository.findOne({ where: { name: login } });
    if (!user) {
      throw new ForbiddenException(ExceptionsMessage.NOT_FOUND_USER);
    }
    if (user.status === IsBlockedStatus.BLOCKED_STATUS) {
      throw new ForbiddenException(ExceptionsMessage.STATUS_BLOCKED);
    }
    return user;
  }

  async checkUserInBd(login: string) {
    const user = await this.userRepository.findOne({ where: { login: login } });
    if (user) throw new ForbiddenException(ExceptionsMessage.ALREADY_EXISTS);
  }

  private async checkPassword(
    password: SignInDto['password'],
    existsPassword: string,
  ): Promise<boolean> {
    const passwordMatch = await bcrypt.compare(password, existsPassword);
    if (!passwordMatch) {
      throw new ForbiddenException(ExceptionsMessage.FORBIDDEN);
    }
    return passwordMatch;
  }

  async validateUser(name: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { name: name },
    });

    const isCorrectPassword = await this.checkPassword(password, user.password);
    if (isCorrectPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
