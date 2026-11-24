import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { animals: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { animals: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const trimmedName = createCategoryDto.name.trim();

    const existing = await this.prisma.category.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      throw new ConflictException(`Category "${trimmedName}" already exists`);
    }

    return this.prisma.category.create({
      data: {
        name: trimmedName,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
