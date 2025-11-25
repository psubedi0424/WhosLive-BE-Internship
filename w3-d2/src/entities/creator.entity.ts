// src/entities/creator.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Video } from './video.entity';

@Entity()
export class Creator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  platform: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Video, (v) => v.creator)
  videos: Video[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
