import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { ChapterEntity } from '@/core/entities/chapter.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import {
  CourseStatus,
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

  async create(values: LessonCreateDto): Promise<number> {
    if (
      !(await this.chapterRepo.existsBy({
        id: values.chapterId,
        course: { id: values.courseId },
      }))
    ) {
      throw new DomainError('Chapter not found');
    }

    const result = await this.lessonRepo.insert({
      title: values.title,
      sortOrder: values.sortOrder,
      lexical: values.lexical,
      trial: values.trial,
      type: values.type,
      chapter: { id: values.chapterId },
      slug: await normalizeSlug({
        value: values.slug,
        exists: (v) => {
          return this.chapterRepo.existsBy({ slug: v });
        },
        serial: false,
      }),
    });

    return result.identifiers[0].id;
  }

  async update(values: LessonUpdateDto): Promise<LessonDto> {
    const entity = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.chapter', 'chapter')
      .leftJoinAndSelect('chapter.course', 'course')
      .where('lesson.id = :id', { id: values.id })
      .andWhere('chapter.course_id = :courseId', { courseId: values.courseId })
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
      html: values.html,
      trial: values.trial,
      wordCount: values.wordCount,
      slug:
        entity.slug !== values.slug
          ? await normalizeSlug({
              value: values.slug,
              exists: (v) => {
                return this.chapterRepo.existsBy({ slug: v });
              },
              serial: false,
            })
          : undefined,
    });

    const lesson = await this.lessonRepo.findOneByOrFail({ id: values.id });

    if (!values.title && !values.lexical) {
      return lesson.toDto();
    }

    this.lessonRevisionService.save(entity.toDto(), lesson.toDto());

    return lesson.toDto();
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

  async delete(courseId: number, lessonId: number): Promise<void> {
    const exists = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoin('lesson.chapter', 'chapter')
      .where('lesson.id = :id', { id: lessonId })
      .andWhere('chapter.course_id = :courseId', { courseId: courseId })
      .getExists();

    if (!exists) {
      throw new DomainError('Lesson not found');
    }
    await this.dataSource.transaction(async (em) => {
      const firstLesson = await em
        .createQueryBuilder(LessonEntity, 'lesson')
        .leftJoin('lesson.chapter', 'chapter')
        .where('chapter.course_id = :courseId', { courseId })
        .andWhere('lesson.id != :lessonId', { lessonId })
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
      await em.delete(LessonEntity, { id: lessonId });
    });
  }

  async findById(id: number): Promise<LessonDto | undefined> {
    const entity = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.chapter', 'chapter')
      .leftJoinAndSelect('chapter.course', 'course')
      .leftJoinAndSelect('lesson.quizzes', 'quiz')
      .leftJoinAndSelect('quiz.answers', 'answer')
      .where('lesson.id = :id', { id })
      .getOne();

    return entity?.toDto();
  }

  async findBySlug(slug: string): Promise<LessonDto | undefined> {
    const entity = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.chapter', 'chapter')
      .leftJoinAndSelect('chapter.course', 'course')
      .leftJoinAndSelect('lesson.quizzes', 'quiz')
      .leftJoinAndSelect('quiz.answers', 'answer')
      .where('lesson.slug = :slug', { slug })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .getOne();

    return entity?.toDto();
  }
}
