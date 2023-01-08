import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {

  @IsOptional()
  reviewId?: string;

  @IsNotEmpty({ message: 'The text cannot be empty' })
  text: string;

  @IsString()
  createdAt?: string;
}
