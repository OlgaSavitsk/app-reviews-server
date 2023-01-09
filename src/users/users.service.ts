import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';

import { CreateUserDto } from './dto/create-user-dto';
import { UserEntity } from './entity/user.entity';
import { ExceptionsMessage } from 'src/app.constant';
import { UserResponse } from './models/users.interface';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  public async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponse());
  }

  public async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['reviews'],
    });
    return user.toResponse() ?? null;
  }

  public async createUser(dto: CreateUserDto): Promise<UserResponse> {
    const userCreated = await this.userRepository.create(dto);
    if (userCreated) {
      const user = (await this.userRepository.save(userCreated)).toResponse();
      return user;
    }
    throw new HttpException(ExceptionsMessage.BAD_REQUEST, StatusCodes.BAD_REQUEST);
  }

  public async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const userUpdated = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userUpdated) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_USER);
    }
    if (dto.status === userUpdated.status) {
      throw new ForbiddenException(ExceptionsMessage.FORBIDDEN);
    }
    let updateUser
      updateUser = await this.userRepository.save({
        ...userUpdated,
        status: dto.status,
      });
    return updateUser;
  }

  public async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_USER);
    }
  }
}
