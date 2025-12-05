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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const creator_entity_1 = require("../entities/creator.entity");
const typeorm_2 = require("@nestjs/typeorm");
let CreatorService = class CreatorService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [items, total] = await this.repo
            .createQueryBuilder('creator')
            .orderBy('creator.createdAt', 'DESC')
            .skip(offset)
            .take(limit)
            .getManyAndCount();
        return {
            items,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        };
    }
    async listByCursor(cursor, limit = 10) {
        const qb = this.repo
            .createQueryBuilder('creator')
            .orderBy('creator.createdAt', 'DESC')
            .addOrderBy('creator.id', 'DESC')
            .take(limit + 1);
        if (cursor) {
            const cursorString = Buffer.from(cursor, 'base64').toString('utf8');
            const cursorData = JSON.parse(cursorString);
            if (Array.isArray(cursorData) &&
                cursorData.length === 2 &&
                typeof cursorData[0] === 'string' &&
                typeof cursorData[1] === 'string') {
                const [cursorDate, cursorId] = cursorData;
                qb.where('(creator.createdAt < :date) OR (creator.createdAt = :date AND creator.id < :id)', { date: cursorDate, id: cursorId });
            }
            else {
                throw new Error('Invalid cursor format');
            }
        }
        const rows = await qb.getMany();
        let nextCursor;
        if (rows.length > limit) {
            const next = rows[limit];
            nextCursor = Buffer.from(JSON.stringify([next.createdAt, next.id])).toString('base64');
            rows.pop();
        }
        return { items: rows, nextCursor };
    }
    async create(payload) {
        const ent = this.repo.create(payload);
        return await this.repo.save(ent);
    }
    async findOne(id) {
        return await this.repo.findOne({ where: { id } });
    }
};
exports.CreatorService = CreatorService;
exports.CreatorService = CreatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(creator_entity_1.Creator)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CreatorService);
//# sourceMappingURL=creator.service.js.map