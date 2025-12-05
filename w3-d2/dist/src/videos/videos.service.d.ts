import { Repository } from 'typeorm';
import { Video } from '../entities/video.entity';
import { Creator } from '../entities/creator.entity';
import { Category } from '../entities/category.entity';
import { CreateVideoDto } from './video.dto';
export declare class VideoService {
    private readonly videoRepo;
    private readonly creatorRepo;
    private readonly categoryRepo;
    constructor(videoRepo: Repository<Video>, creatorRepo: Repository<Creator>, categoryRepo: Repository<Category>);
    findAll(page?: number, limit?: number): Promise<{
        items: Video[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Video>;
    findLiveVideos(): Promise<Video[]>;
    create(payload: CreateVideoDto): Promise<Video>;
    remove(id: string): Promise<void>;
}
