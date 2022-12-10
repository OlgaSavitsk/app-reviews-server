import { IsString } from 'class-validator';

export class CreateRoleDto {
  id?: string;
  @IsString()
  value: string;
}
