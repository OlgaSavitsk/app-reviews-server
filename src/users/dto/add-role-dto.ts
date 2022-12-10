import { IsString } from 'class-validator';

export class AddRoleDto {
  @IsString({ message: 'The user name must be a string' })
  readonly value: string;
  @IsString({ message: 'The user login must be a string' })
  readonly userId: string;
}
