import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './creator.dto';
export declare class CreatorController {
    private service;
    constructor(service: CreatorService);
    create(dto: CreateCreatorDto): Promise<import("../entities/creator.entity").Creator>;
    list(page: number, limit: number): Promise<{
        items: import("../entities/creator.entity").Creator[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    listByCursor(cursor?: string, limit?: number): Promise<{
        items: import("../entities/creator.entity").Creator[];
        nextCursor: string;
    }>;
}
