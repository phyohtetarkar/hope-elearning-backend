import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { ChapterEntity } from '@/core/entities/chapter.entity';
import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { LessonRevisionEntity } from '@/core/entities/lesson-revision.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import {
  ChapterCreateDto,
  ChapterDto,
  ChapterUpdateDto,
  SortUpdateDto,
} from '@/core/models';
import { ChapterService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormChapterService implements ChapterService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepo: Repository<ChapterEntity>,
  ) {}

  async create(values: ChapterCreateDto): Promise<number> {
    if (!(await this.courseRepo.existsBy({ id: values.courseId }))) {
      throw new DomainError('Course not found');
    }

    const result = await this.chapterRepo.insert({
      title: values.title,
      sortOrder: values.sortOrder,
      course: { id: values.courseId },
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

  async update(values: ChapterUpdateDto): Promise<void> {
    const entity = await this.chapterRepo
      .createQueryBuilder('chapter')
      .where('chapter.id = :id', { id: values.id })
      .andWhere('chapter.course_id = :courseId', { courseId: values.courseId })
      .getOne();

    if (!entity) {
      throw new DomainError('Chapter not found');
    }

    const dbUpdatedAt = new Date(entity.updatedAt).getTime();
    const userUpdatedAt = new Date(values.updatedAt).getTime();

    if (dbUpdatedAt > userUpdatedAt) {
      throw new DomainError('Update conflict by another user. Please refresh.');
    }

    await this.chapterRepo.update(values.id, {
      title: values.title,
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
  }

  async updateSort(values: SortUpdateDto[]): Promise<void> {
    if (values.length === 0) return;
    await this.dataSource.transaction(async (em) => {
      for (const v of values) {
        await em
          .createQueryBuilder()
          .update(ChapterEntity, {
            sortOrder: v.sortOrder,
          })
          .where('id = :id', { id: v.id })
          .callListeners(false)
          .execute();
      }
    });
  }

  async delete(courseId: number, chapterId: number): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.delete(CompletedLessonEntity, {
        courseId: courseId,
        chapter: { chapterId },
      });

      await em.delete(LessonRevisionEntity, {
        course: { id: courseId },
        chapter: { id: chapterId },
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
        { courseId: courseId, resumeLesson: { chapterId: chapterId } },
        {
          resumeLesson: firstLesson ? { id: firstLesson.id } : null,
        },
      );

      await em.delete(LessonEntity, {
        courseId: courseId,
        chapterId: chapterId,
      });
      await em.delete(ChapterEntity, {
        id: chapterId,
        course: { id: courseId },
      });
    });
  }

  async findById(id: number): Promise<ChapterDto | undefined> {
    const entity = await this.chapterRepo.findOneBy({ id: id });
    return entity?.toDto();
  }
}
