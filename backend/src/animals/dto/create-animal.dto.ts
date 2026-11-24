import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnimalDto {
  @ApiProperty({ example: 'Royal Bengal Tiger', description: 'Unique name of the animal' })
  @IsNotEmpty({ message: 'Animal name is required' })
  @IsString({ message: 'Animal name must be a string' })
  @MinLength(2, { message: 'Animal name must be at least 2 characters' })
  name: string;

  @ApiProperty({ example: 'clx... / category id', description: 'ID of the category' })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString({ message: 'Category ID must be a string' })
  categoryId: string;

  @ApiPropertyOptional({ description: 'Base64 image string or existing image URL if not uploading a file' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
