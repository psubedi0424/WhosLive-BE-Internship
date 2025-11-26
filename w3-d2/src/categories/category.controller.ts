import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private service: CategoryService) { }

    @Get()
    list() {
        return this.service.findAll();
    }

    @Get('slug/:slug')
    getBySlug(@Param('slug') slug: string) {
        return this.service.findBySlug(slug);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.findOne(id);
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