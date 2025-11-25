import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Creator } from './creator.entity';
import { Category } from './category.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Creator, (creator) => creator.videos, { eager: false })
  creator: Creator;

  @ManyToMany(() => Category, (c) => c.videos, { eager: false })
  @JoinTable()
  categories: Category[];

  @Column({ default: false })
  @Index()
  isLive: boolean;

  @Column({ default: 0 })
  @Index()
  viewerCount: number;
  @CreateDateColumn()
  startedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
