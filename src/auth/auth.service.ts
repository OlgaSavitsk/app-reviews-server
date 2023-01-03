import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Response, Request } from 'express';

import { SignInDto } from './dto/signin-dto';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entity/user.entity';
import { Token } from './models/token.model';
import { ExceptionsMessage, IsBlockedStatus } from 'src/app.constant';
import { Role } from 'src/roles/entity/role.enum';
import { UserResponse, UserSocialLogin } from 'src/users/models/users.interface';
import { comparePassword, getHashData } from 'src/helpers/hash.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  getToken(userId: string, name: string, roles: Role[]): Token {
    const accessToken = this.jwtService.sign({ username: name, sub: userId, roles: roles });
    return {
      access_token: accessToken,
    };
  }

  async signup(userDto: CreateUserDto): Promise<UserResponse> {
    await this.checkUserInBd(userDto.login);
    const date = String(Date.now());
    const passwordHash = await getHashData(userDto.password);
    const newUser = await this.userService.createUser({
      ...userDto,
      password: passwordHash,
      createdAt: date,
      updatedAt: date,
      roles: userDto.roles,
      photos: null,
    });
    await this.checkUser(newUser.login);
    return newUser;
  }

  async signUpGoogle(details: UserSocialLogin): Promise<UserResponse> {
    const date = String(Date.now());
    const user = await this.userRepository.findOne({
      where: { login: details.login },
      relations: ['reviews'],
    });
    if (user) {
      const newUser = await this.userService.createUser({
        ...user,
        updatedAt: date,
      });
      return newUser;
    }
    const newUser = await this.userService.createUser({
      ...details,
      createdAt: date,
      updatedAt: date,
    });
    return newUser;
  }

  async signin(dto: SignInDto, req: Request, res: Response) {
    const user = await this.checkUser(dto.username);
    await this.checkPassword(dto.password, user.password);
    await this.userService.createUser({
      ...user,
      updatedAt: String(Date.now()),
    });
    const { access_token } = await this.getToken(user.id, dto.username, user.roles);
    if (!access_token) {
      throw new ForbiddenException();
    }
    res.cookie('token', access_token, { httpOnly: true });
    return res.send({ message: 'Logged successfully' });
  }

  async signout(res: Response) {
    await res.clearCookie('token');
    await res.clearCookie('connect.sid');
    return res.send({ message: 'Logged out successfully' });
  }

  async checkUser(login: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { username: login },
      relations: ['reviews'],
    });
    if (!user) {
      throw new ForbiddenException(ExceptionsMessage.NOT_FOUND_USER);
    }
    if (user.status === IsBlockedStatus.BLOCKED_STATUS) {
      throw new ForbiddenException(ExceptionsMessage.STATUS_BLOCKED);
    }
    return user;
  }

  async checkUserInBd(login: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { login: login },
      relations: ['reviews'],
    });
    if (user) throw new ForbiddenException(ExceptionsMessage.ALREADY_EXISTS);
    return user;
  }

  private async checkPassword(
    password: SignInDto['password'],
    existsPassword: string
  ): Promise<boolean> {
    const passwordMatch = comparePassword(password, existsPassword);
    if (!passwordMatch) {
      throw new ForbiddenException(ExceptionsMessage.NOT_FOUND_USER);
    }
    return passwordMatch;
  }

  async validateUser(name: string, password: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { username: name },
      relations: ['reviews'],
    });
    if (!user) {
      throw new ForbiddenException(ExceptionsMessage.NOT_FOUND_USER);
    }
    if (user.status === IsBlockedStatus.BLOCKED_STATUS) {
      throw new ForbiddenException(ExceptionsMessage.STATUS_BLOCKED);
    }
    const isCorrectPassword = await this.checkPassword(password, user.password);
    if (isCorrectPassword) {
      return user.toResponse();
    }
    return null;
  }
}
