import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { LessonDto } from '../models/lesson.dto';
import { ChapterEntity } from './chapter.entity';

@Entity({ name: 'lesson' })
export class LessonEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ type: 'text' })
  lexical: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => ChapterEntity, (type) => type.lessons)
  chapter: ChapterEntity;

  toDto() {
    return new LessonDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      lexical: this.lexical,
      duration: this.duration,
      completed: this.completed,
      chapter: this.chapter.toDto(),
      audit: this.toAudit(),
    });
  }
}
