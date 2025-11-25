import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Video } from '../entities/video.entity';
import { Creator } from '../entities/creator.entity';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './video.dto';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepo: Repository<Video>,
        @InjectRepository(Creator)
        private readonly creatorRepo: Repository<Creator>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [items, total] = await this.videoRepo
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.creator', 'creator')
            .leftJoinAndSelect('video.categories', 'categories')
            .orderBy('video.startedAt', 'DESC')
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return {
            items,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        };
    }

    async findOne(id: string) {
        const video = await this.videoRepo.findOne({
            where: { id },
            relations: ['creator', 'categories']
        });

        if (!video) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }

        return video;
    }

    async findLiveVideos() {
        return await this.videoRepo.find({
            where: { isLive: true },
            relations: ['creator', 'categories'],
            order: { viewerCount: 'DESC' }
        });
    }

    async create(payload: CreateVideoDto) {
        const { creatorId, categoryIds, ...videoData } = payload;

        // Find creator
        const creator = await this.creatorRepo.findOne({ where: { id: creatorId } });
        if (!creator) {
            throw new NotFoundException(`Creator with ID ${creatorId} not found`);
        }

        // Find categories if provided
        let categories: Category[] = [];
        if (categoryIds && categoryIds.length > 0) {
            categories = await this.categoryRepo.find({
                where: { id: In(categoryIds) }
            });
        }

        const video = this.videoRepo.create({
          ...videoData,
            creator,
            categories
        });

        return await this.videoRepo.save(video);
    }

    async remove(id: string) {
        const result = await this.videoRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Video with ID ${id} not found`);
        }
    }
}