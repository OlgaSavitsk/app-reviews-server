import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDto {
  id?: string;

  @ApiProperty({ example: 'blocked', description: 'User new status' })
  @IsString({ message: 'The user status must be a string' })
  @IsNotEmpty({ message: 'The user status cannot be empty' })
  status: string;
}
