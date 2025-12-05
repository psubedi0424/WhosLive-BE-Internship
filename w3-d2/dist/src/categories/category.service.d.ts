import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './category.dto';
export declare class CategoryService {
    private readonly repo;
    constructor(repo: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    create(payload: CreateCategoryDto): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
