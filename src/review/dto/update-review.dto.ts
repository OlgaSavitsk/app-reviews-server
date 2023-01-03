import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateReviewDto {

  @ApiProperty({ example: 'Review: Avatar review', description: 'Review name' })
  @IsString({ message: 'The review name must be a string' })
  name: string;

  @ApiProperty({ example: 'Avatar', description: 'Title of art' })
  @IsString({ message: 'The review title must be a string' })
  title: string;

  @ApiProperty({ example: 'The film is impressive', description: 'Review description' })
  @IsString({ message: 'The review description must be a string' })
  description: string;

  @ApiProperty({ example: 'Movies', description: 'Review category' })
  @IsNotEmpty({ message: 'The review category cannot be empty' })
  category: string;
  
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: '2', description: 'Author score' })
  @IsNotEmpty({ message: 'The score review cannot be empty' })
  score: number;

  rating?: number;

  like?: number;

  img?: any;

  createdAt?: string;

  filePath?: string
}