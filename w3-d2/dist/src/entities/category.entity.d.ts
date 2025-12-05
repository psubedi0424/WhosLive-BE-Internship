import { Video } from './video.entity';
export declare class Category {
    id: string;
    slug: string;
    name: string;
    title: string;
    videos: Video[];
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
