import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'Review: Avatar review', description: 'Review name' })
  @IsNotEmpty({ message: 'The review name cannot be empty' })
  @IsString({ message: 'The review name must be a string' })
  name: string;

  @ApiProperty({ example: 'Avatar', description: 'Title of art' })
  @IsNotEmpty({ message: 'The review title cannot be empty' })
  @IsString({ message: 'The review title must be a string' })
  title: string;

  @ApiProperty({ example: 'The film is impressive', description: 'Review description' })
  @IsNotEmpty({ message: 'The review description cannot be empty' })
  @IsString({ message: 'The review description must be a string' })
  description: string;

  @ApiProperty({ example: 'Movies', description: 'Review category' })
  @IsNotEmpty({ message: 'The review category cannot be empty' })
  category: string;

  @IsOptional()
  tags?: string[];

  filePath?: string;

  img?: any;

  @ApiProperty({ example: '2', description: 'Author score' })
  @IsNotEmpty({ message: 'The score review cannot be empty' })
  score: number;

  like?: number;

  createdAt?: string;
}
