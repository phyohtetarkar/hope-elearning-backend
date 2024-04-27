import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { ChapterEntity } from './chapter.entity';
import { LessonDto } from '../models';

@Entity({ name: 'lesson' })
export class LessonEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ default: false })
  trial: boolean;

  @Column({ type: 'text', nullable: true })
  lexical?: string | null;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => ChapterEntity, (type) => type.lessons)
  chapter: ChapterEntity;

  toDto() {
    return new LessonDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      lexical: this.lexical ?? undefined,
      chapter: this.chapter.toDto(),
      audit: this.toAudit(),
    });
  }
}
