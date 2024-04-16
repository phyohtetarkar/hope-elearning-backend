import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';
import { ChapterEntity } from './chapter.entity';
import { LessonEntity } from './lesson.entity';

export class CourseProgressEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @PrimaryColumn({ name: 'chapter_id', type: 'bigint' })
  chapterId: number;

  @PrimaryColumn({ name: 'lesson_id', type: 'bigint' })
  lessonId: number;

  @Column()
  completed: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => ChapterEntity)
  @JoinColumn({ name: 'chapter_id' })
  chapter: ChapterEntity;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;
}
