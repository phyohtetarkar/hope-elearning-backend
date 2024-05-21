import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { ChapterEntity } from '@/core/entities/chapter.entity';
import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { LessonRevisionEntity } from '@/core/entities/lesson-revision.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import {
  LessonCreateDto,
  LessonDto,
  LessonUpdateDto,
  SortUpdateDto,
} from '@/core/models';
import {
  LESSON_REVISION_SERVICE,
  LessonRevisionService,
  LessonService,
} from '@/core/services';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormLessonService implements LessonService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepo: Repository<ChapterEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepo: Repository<LessonEntity>,
    @Inject(LESSON_REVISION_SERVICE)
    private lessonRevisionService: LessonRevisionService,
  ) {}

  async create(values: LessonCreateDto): Promise<string> {
    if (!(await this.courseRepo.existsBy({ id: values.courseId }))) {
      throw new DomainError('Course not found');
    }

    if (!(await this.chapterRepo.existsBy({ id: values.chapterId }))) {
      throw new DomainError('Chapter not found');
    }

    const result = await this.lessonRepo.insert({
      title: values.title,
      sortOrder: values.sortOrder,
      lexical: values.lexical,
      trial: values.trial,
      course: { id: values.courseId },
      chapterId: values.chapterId,
      slug: await normalizeSlug(
        values.slug,
        (v) => {
          return this.chapterRepo.existsBy({ slug: v });
        },
        false,
      ),
    });

    return result.identifiers[0].id;
  }

  async update(values: LessonUpdateDto): Promise<void> {
    const entity = await this.lessonRepo
      .createQueryBuilder('lesson')
      .where('lesson.id = :id', { id: values.id })
      .andWhere('lesson.course_id = :courseId', { courseId: values.courseId })
      .getOne();

    if (!entity) {
      throw new DomainError('Lesson not found');
    }

    const dbUpdatedAt = new Date(entity.updatedAt).getTime();
    const userUpdatedAt = new Date(values.updatedAt).getTime();

    if (dbUpdatedAt > userUpdatedAt) {
      throw new DomainError('Update conflict by another user. Please refresh.');
    }

    await this.lessonRepo.update(values.id, {
      title: values.title,
      lexical: values.lexical,
      trial: values.trial,
      wordCount: values.wordCount,
      slug:
        entity.slug !== values.slug
          ? await normalizeSlug(
              values.slug,
              (v) => {
                return this.chapterRepo.existsBy({ slug: v });
              },
              false,
            )
          : undefined,
    });

    const lesson = await this.lessonRepo.findOneByOrFail({ id: values.id });

    this.lessonRevisionService.save(entity.toDto(), lesson.toDto());

    // return lesson.toDto();
  }

  async updateSort(values: SortUpdateDto[]): Promise<void> {
    if (values.length === 0) return;

    await this.dataSource.transaction(async (em) => {
      for (const v of values) {
        await em
          .createQueryBuilder()
          .update(LessonEntity, {
            sortOrder: v.sortOrder,
          })
          .where('id = :id', { id: v.id })
          .callListeners(false)
          .execute();
      }
    });
  }

  async delete(courseId: string, lessonId: string): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.delete(CompletedLessonEntity, {
        courseId: courseId,
        lessonId: lessonId,
      });

      await em.delete(LessonRevisionEntity, {
        lessonId: lessonId,
        course: { id: courseId },
      });

      const firstLesson = await em
        .createQueryBuilder(LessonEntity, 'lesson')
        .leftJoin('lesson.chapter', 'chapter')
        .where('lesson.courseId = :courseId', { courseId: courseId })
        .orderBy('chapter.sortOrder', 'ASC')
        .addOrderBy('lesson.sortOrder', 'ASC')
        .limit(1)
        .getOne();

      await em.update(
        EnrolledCourseEntity,
        { courseId: courseId, resumeLesson: { id: lessonId } },
        {
          resumeLesson: firstLesson ? { id: firstLesson.id } : null,
        },
      );
      await em.delete(LessonEntity, { id: lessonId, courseId: courseId });
    });
  }

  async findById(id: string): Promise<LessonDto | undefined> {
    const entity = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.chapter', 'chapter')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('lesson.id = :id', { id })
      .getOne();

    return entity?.toDto();
  }

  async findBySlug(slug: string): Promise<LessonDto | undefined> {
    const entity = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.chapter', 'chapter')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('lesson.slug = :slug', { slug })
      .getOne();

    return entity?.toDto();
  }
}
