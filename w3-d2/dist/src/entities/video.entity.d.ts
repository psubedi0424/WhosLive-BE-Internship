import { Creator } from './creator.entity';
import { Category } from './category.entity';
export declare class Video {
    id: string;
    title: string;
    description: string;
    creator: Creator;
    categories: Category[];
    isLive: boolean;
    viewerCount: number;
    startedAt: Date;
    updatedAt: Date;
}
