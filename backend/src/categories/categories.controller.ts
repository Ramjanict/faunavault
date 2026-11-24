import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('api/categories')
  @ApiOperation({ summary: 'Get all categories with animal counts' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }

  @Post('api/categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  }

  // Legacy route compatibility
  @Post('api/add-category')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Legacy endpoint to add a category' })
  async legacyAddCategory(@Body() body: any) {
    const name = body.name || body.category;
    const category = await this.categoriesService.create({ name });
    return {
      success: true,
      message: 'Category added successfully',
      data: category,
    };
  }

  @Delete('api/categories/:id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  async remove(@Param('id') id: string) {
    const deleted = await this.categoriesService.remove(id);
    return {
      success: true,
      message: 'Category deleted successfully',
      data: deleted,
    };
  }
}
