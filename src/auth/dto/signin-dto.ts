import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'test', description: 'Login user' })
  @IsNotEmpty({ message: 'The user login cannot be empty' })
  @IsString({ message: 'The user login must be a string' })
  username: string;

  @ApiProperty({ example: '123R', description: 'Password user' })
  @IsNotEmpty({ message: 'The user password cannot be empty' })
  @IsString({ message: 'The user password must be a string' })
  password: string;
}
