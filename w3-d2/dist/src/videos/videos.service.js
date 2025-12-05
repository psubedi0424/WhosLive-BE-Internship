"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const video_entity_1 = require("../entities/video.entity");
const creator_entity_1 = require("../entities/creator.entity");
const category_entity_1 = require("../entities/category.entity");
const typeorm_2 = require("@nestjs/typeorm");
let VideoService = class VideoService {
    constructor(videoRepo, creatorRepo, categoryRepo) {
        this.videoRepo = videoRepo;
        this.creatorRepo = creatorRepo;
        this.categoryRepo = categoryRepo;
    }
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
    async findOne(id) {
        const video = await this.videoRepo.findOne({
            where: { id },
            relations: ['creator', 'categories']
        });
        if (!video) {
            throw new common_1.NotFoundException(`Video with ID ${id} not found`);
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
    async create(payload) {
        const { creatorId, categoryIds } = payload, videoData = __rest(payload, ["creatorId", "categoryIds"]);
        const creator = await this.creatorRepo.findOne({ where: { id: creatorId } });
        if (!creator) {
            throw new common_1.NotFoundException(`Creator with ID ${creatorId} not found`);
        }
        let categories = [];
        if (categoryIds && categoryIds.length > 0) {
            categories = await this.categoryRepo.find({
                where: { id: (0, typeorm_1.In)(categoryIds) }
            });
        }
        const video = this.videoRepo.create(Object.assign(Object.assign({}, videoData), { creator,
            categories }));
        return await this.videoRepo.save(video);
    }
    async remove(id) {
        const result = await this.videoRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Video with ID ${id} not found`);
        }
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(video_entity_1.Video)),
    __param(1, (0, typeorm_2.InjectRepository)(creator_entity_1.Creator)),
    __param(2, (0, typeorm_2.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], VideoService);
//# sourceMappingURL=videos.service.js.map