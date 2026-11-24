import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterAnimalDto {
  @ApiPropertyOptional({ description: 'Filter animals by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Search animals by name' })
  @IsOptional()
  @IsString()
  search?: string;
}
