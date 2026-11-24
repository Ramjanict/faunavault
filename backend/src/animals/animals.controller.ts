import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { FilterAnimalDto } from './dto/filter-animal.dto';

@ApiTags('Animals')
@Controller()
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get('api/animals')
  @ApiOperation({ summary: 'Get all animals with optional category and search filters' })
  async findAll(@Query() query: FilterAnimalDto) {
    const animals = await this.animalsService.findAll(query);
    return {
      success: true,
      message: 'Animals retrieved successfully',
      data: animals,
    };
  }

  // Backward compatibility endpoint for legacy frontend
  @Get('api/all-category')
  @ApiOperation({ summary: 'Legacy endpoint to get all animals' })
  async legacyGetAllCategory() {
    const animals = await this.animalsService.findAll();
    return {
      success: true,
      message: 'Get all category',
      data: animals.map((a) => ({
        ...a,
        animalName: a.name,
      })),
    };
  }

  @Post('api/animals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new animal with image upload to Cloudinary' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: CreateAnimalDto = {
      name: body.name || body.animalName,
      categoryId: body.categoryId,
      imageUrl: body.imageUrl,
    };

    if (!dto.name) {
      throw new BadRequestException('Animal name is required');
    }
    if (!dto.categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    const animal = await this.animalsService.create(dto, file);
    return {
      success: true,
      message: 'Animal added successfully',
      data: animal,
    };
  }

  // Backward compatibility endpoint for legacy frontend
  @Post('api/upload-animal')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Legacy endpoint to upload an animal' })
  @UseInterceptors(FileInterceptor('file'))
  async legacyUploadAnimal(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    return this.create(body, file);
  }

  @Delete('api/animals/:id')
  @ApiOperation({ summary: 'Delete an animal by ID (removes record & deletes Cloudinary image)' })
  async remove(@Param('id') id: string) {
    const deleted = await this.animalsService.remove(id);
    return {
      success: true,
      message: 'Animal deleted successfully',
      data: deleted,
    };
  }
}
