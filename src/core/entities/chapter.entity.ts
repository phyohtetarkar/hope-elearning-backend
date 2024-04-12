import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { ChapterLessonEntity } from './chapter-lesson.entity';
import { ChapterDto } from '../models/chapter.dto';

@Entity({ name: 'chapter' })
export class ChapterEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 2000 })
  name: string;

  @OneToMany(() => ChapterLessonEntity, (type) => type.chapter)
  lessons: ChapterLessonEntity[];

  toDto() {
    return new ChapterDto({
      id: this.id,
      name: this.name,
      lessons: this.lessons.map((e) => e.chapter.toDto()),
      audit: this.toAudit(),
    });
  }
}
