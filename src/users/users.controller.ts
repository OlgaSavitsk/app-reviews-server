import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user-dto';
import { UpdateStatusDto } from './dto/update-user-dto';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { Roles } from 'src/core/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/roles/entity/role.enum';
import { UserResponse } from './models/users.interface';
import { AuthenticatedGuard } from '@auth/guards/github.guard';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UserEntity],
  })
  //@UseGuards(AuthenticatedGuard, RolesGuard)
  //@Roles(Role.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  public findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() userDto: CreateUserDto): Promise<UserResponse> {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateStatusDto,
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() { status }: UpdateStatusDto
  ) {
    return await this.userService.update(id, status);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
    return await this.userService.delete(id);
  }
}
