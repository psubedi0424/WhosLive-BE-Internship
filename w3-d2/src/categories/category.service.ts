import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll() {
    return await this.repo.find({
      order: { title: 'ASC' },
    });
  }

  async findOne(id: string) {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.repo.findOne({
      where: { slug },
      relations: ['videos'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }

  async create(payload: CreateCategoryDto) {
    const ent = this.repo.create(payload);
    return await this.repo.save(ent);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return { message: 'Category deleted successfully'};
    }
}