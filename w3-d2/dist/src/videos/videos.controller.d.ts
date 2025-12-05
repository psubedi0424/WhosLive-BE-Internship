import { VideoService } from './videos.service';
import { CreateVideoDto } from './video.dto';
export declare class VideoController {
    private service;
    constructor(service: VideoService);
    list(page: number, limit: number): Promise<{
        items: import("../entities/video.entity").Video[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getLiveVideos(): Promise<import("../entities/video.entity").Video[]>;
    get(id: string): Promise<import("../entities/video.entity").Video>;
    create(dto: CreateVideoDto): Promise<import("../entities/video.entity").Video>;
    remove(id: string): Promise<void>;
}
