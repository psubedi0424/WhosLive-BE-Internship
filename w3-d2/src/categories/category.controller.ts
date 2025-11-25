import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './categrory.dto';

@Controller('categories')
export class CategoryController {
    constructor(private service: CategoryService) { }

    @Get()
    list() {
        return this.service.findAll();
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Get('slug/:slug')
    getBySlug(@Param('slug') slug: string) {
        return this.service.findBySlug(slug);
    }

    @Post()
    create(@Body() dto: CreateCategoryDto) {
        return this.service.create(dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}