import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Creator } from '../entities/creator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCreatorDto } from './creator.dto';

// Define a type for the cursor data
type CursorData = [string, string]; // [createdAt, id]

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(Creator)
    private readonly repo: Repository<Creator>,
  ) { }

  // Offset-based pagination
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

  // Cursor-based pagination by createdAt+id
  async listByCursor(cursor?: string, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('creator')
      .orderBy('creator.createdAt', 'DESC')
      .addOrderBy('creator.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      // Safe parsing with type assertion
      const cursorString = Buffer.from(cursor, 'base64').toString('utf8');
      const cursorData: unknown = JSON.parse(cursorString);

      // Type guard to ensure it's the correct format
      if (
        Array.isArray(cursorData) &&
        cursorData.length === 2 &&
        typeof cursorData[0] === 'string' &&
        typeof cursorData[1] === 'string'
      ) {
        const [cursorDate, cursorId] = cursorData as CursorData;

        qb.where(
          '(creator.createdAt < :date) OR (creator.createdAt = :date AND creator.id < :id)',
          { date: cursorDate, id: cursorId }
        );
      } else {
        throw new Error('Invalid cursor format');
      }
    }

    const rows = await qb.getMany();
    let nextCursor: string 

    if (rows.length > limit) {
      const next = rows[limit];
      nextCursor = Buffer.from(JSON.stringify([next.createdAt, next.id])).toString('base64');
      rows.pop(); // remove extra
    }

    return { items: rows, nextCursor };
  }

  async create(payload: CreateCreatorDto) {
    const ent = this.repo.create(payload);
    return await this.repo.save(ent);
  }

  async findOne(id: string) {
    return await this.repo.findOne({ where: { id } });
  }
}