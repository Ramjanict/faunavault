import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { FilterAnimalDto } from './dto/filter-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findAll(filters: FilterAnimalDto = {}) {
    const { categoryId, search } = filters;
    const where: any = {};

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    if (search && search.trim() !== '') {
      where.name = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    return this.prisma.animal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID "${id}" not found`);
    }
    return animal;
  }

  async create(createAnimalDto: CreateAnimalDto, file?: Express.Multer.File) {
    const trimmedName = createAnimalDto.name.trim();

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createAnimalDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${createAnimalDto.categoryId}" does not exist`);
    }

    // Check unique animal name
    const existing = await this.prisma.animal.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      throw new ConflictException(`Animal with name "${trimmedName}" already exists`);
    }

    // Handle image upload to Cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    if (file) {
      const uploadResult = await this.cloudinary.uploadFile(file, 'animals');
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    } else if (createAnimalDto.imageUrl) {
      const uploadResult = await this.cloudinary.uploadBase64OrUrl(createAnimalDto.imageUrl, 'animals');
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    } else {
      throw new BadRequestException('Please provide an image file or imageUrl');
    }

    return this.prisma.animal.create({
      data: {
        name: trimmedName,
        imageUrl,
        imagePublicId,
        categoryId: createAnimalDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    const animal = await this.findOne(id);

    // Delete image from Cloudinary
    if (animal.imagePublicId) {
      await this.cloudinary.deleteFile(animal.imagePublicId);
    }

    return this.prisma.animal.delete({
      where: { id },
    });
  }
}
