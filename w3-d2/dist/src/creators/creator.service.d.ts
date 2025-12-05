import { Repository } from 'typeorm';
import { Creator } from '../entities/creator.entity';
import { CreateCreatorDto } from './creator.dto';
export declare class CreatorService {
    private readonly repo;
    constructor(repo: Repository<Creator>);
    findAll(page?: number, limit?: number): Promise<{
        items: Creator[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    listByCursor(cursor?: string, limit?: number): Promise<{
        items: Creator[];
        nextCursor: string;
    }>;
    create(payload: CreateCreatorDto): Promise<Creator>;
    findOne(id: string): Promise<Creator>;
}
