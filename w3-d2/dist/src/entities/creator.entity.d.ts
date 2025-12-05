import { Video } from './video.entity';
export declare class Creator {
    id: string;
    username: string;
    name: string;
    email: string;
    platform: string;
    avatar: string;
    videos: Video[];
    createdAt: Date;
    updatedAt: Date;
}
