import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/roles/entity/role.enum';

export class CreateUserDto {
  id?: string;

  @ApiProperty({ example: 'User', description: 'Username' })
  @IsNotEmpty({ message: 'The user name cannot be empty' })
  @IsString({ message: 'The user name must be a string' })
  name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'Unique login' })
  @IsNotEmpty({ message: 'The user login cannot be empty' })
  @IsString({ message: 'The user login must be a string' })
  login: string;

  @ApiProperty({ example: '1234', description: 'Password' })
  @IsNotEmpty({ message: 'The user password cannot be empty' })
  @IsString({ message: 'The user password must be a string' })
  password: string;

  createdAt?: string;

  updatedAt?: string;

  @ApiProperty({ example: 'active', description: 'If the user is not blocked' })
  status?: string;

  roles?: Role[];
}
