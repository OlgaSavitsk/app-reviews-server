import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';

import { CreateUserDto } from './dto/create-user-dto';
import { UserEntity } from './entity/user.entity';
import { ExceptionsMessage } from 'src/app.constant';
import { UserResponse } from './models/users.interface';

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
      //select: ['id', 'username', 'login', 'roles', 'reviews'],
      where: { id: id },
      relations: ['reviews']
    });
    return user.toResponse() ?? null;
  }

  public async createUser(dto: CreateUserDto): Promise<UserResponse> {
    const userCreated = await this.userRepository.create(dto);
    //const role = await this.roleService.getUserRole(dto.role);
    //userCreated.roles = [role];
    if (userCreated) {
      const user = (await this.userRepository.save(userCreated)).toResponse();
      return user;
    }
    throw new HttpException(ExceptionsMessage.BAD_REQUEST, StatusCodes.BAD_REQUEST);
  }

  public async update(id: string, newStatus: string): Promise<UserResponse> {
    const userUpdated = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userUpdated) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_USER);
    }
    if (newStatus === userUpdated.status) {
      throw new ForbiddenException(ExceptionsMessage.FORBIDDEN);
    }
    const updateUser = await await this.userRepository.save({
      ...userUpdated,
      status: newStatus,
    });
    return updateUser;
  }

  public async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_USER);
    }
  }

  // async addRole(dto: AddRoleDto) {
  //   const user = await this.userRepository.findOne({
  //     where: { id: dto.userId },
  //   });
  //   const role = await this.roleService.getUserRole(dto.value);
  // }
}
