import { IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  status?: string;
  @IsOptional()
  liked?: string[];
}
