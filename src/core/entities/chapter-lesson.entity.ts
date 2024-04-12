import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChapterEntity } from './chapter.entity';
import { LessonEntity } from './lesson.entity';

@Entity({ name: 'chapter_lesson' })
export class ChapterLessonEntity {
    @PrimaryColumn({ name: 'chapter_id', type: 'bigint' })
  chapterId: number;

  @PrimaryColumn({ name: 'lesson_id' })
  lessonId: number;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => ChapterEntity, (type) => type.lessons)
  @JoinColumn({ name: 'chapter_id' })
  chapter: ChapterEntity;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;
}
}
