import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';
export declare class CategoryController {
    private service;
    constructor(service: CategoryService);
    list(): Promise<import("../entities/category.entity").Category[]>;
    getBySlug(slug: string): Promise<import("../entities/category.entity").Category>;
    get(id: string): Promise<import("../entities/category.entity").Category>;
    create(dto: CreateCategoryDto): Promise<import("../entities/category.entity").Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
