import { DomainError } from '@/common/errors';
import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';
import { CourseMetaEntity } from '@/core/entities/course-meta.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import {
  CompletedLessonUpdateDto,
  CourseStatus,
  EnrolledCourseDto,
  LessonDto,
  PageDto,
  QueryDto,
  ResumeLessonUpdateDto,
} from '@/core/models';
import { CourseEnrollmentService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormCourseEnrollmentService implements CourseEnrollmentService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepo: Repository<LessonEntity>,
    @InjectRepository(EnrolledCourseEntity)
    private enrolledCourseRepo: Repository<EnrolledCourseEntity>,
    @InjectRepository(CompletedLessonEntity)
    private completedLessonRepo: Repository<CompletedLessonEntity>,
  ) {}

  async enroll(userId: string, courseId: string): Promise<void> {
    const courseExists = await this.courseRepo.existsBy({
      id: courseId,
      status: CourseStatus.PUBLISHED,
    });

    if (!courseExists) {
      throw new DomainError('Course not found');
    }

    const exists = await this.enrolledCourseRepo.existsBy({
      userId: userId,
      courseId: courseId,
    });

    if (exists) {
      throw new DomainError('Course already enrolled');
    }

    const firstLesson = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoin('lesson.chapter', 'chapter')
      .where('lesson.courseId = :courseId', { courseId: courseId })
      .orderBy('chapter.sortOrder', 'ASC')
      .addOrderBy('lesson.sortOrder', 'ASC')
      .limit(1)
      .getOne();

    if (!firstLesson) {
      throw new DomainError('No lessons found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.insert(EnrolledCourseEntity, {
        userId: userId,
        courseId: courseId,
        resumeLesson: { id: firstLesson.id },
      });

      await em.increment(
        CourseMetaEntity,
        { id: courseId },
        'enrolledCount',
        1,
      );
    });
  }

  async remove(userId: string, courseId: string): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.delete(CompletedLessonEntity, {
        userId: userId,
        courseId: courseId,
      });
      await em.delete(EnrolledCourseEntity, {
        userId: userId,
        courseId: courseId,
      });

      await em.decrement(
        CourseMetaEntity,
        { id: courseId },
        'enrolledCount',
        1,
      );
    });
  }

  async updateResumeLesson(values: ResumeLessonUpdateDto): Promise<void> {
    const enrolled = await this.enrolledCourseRepo.existsBy({
      userId: values.userId,
      courseId: values.courseId,
    });

    if (!enrolled) {
      throw new DomainError('Course not enrolled');
    }

    if (!(await this.lessonRepo.existsBy({ id: values.lessonId }))) {
      throw new DomainError('Lesson not found');
    }

    await this.enrolledCourseRepo.update(
      {
        userId: values.userId,
        courseId: values.courseId,
      },
      {
        resumeLesson: { id: values.lessonId },
      },
    );
  }

  async insertCompletedLesson(values: CompletedLessonUpdateDto): Promise<void> {
    const enrolled = await this.enrolledCourseRepo.existsBy({
      userId: values.userId,
      courseId: values.courseId,
    });

    if (!enrolled) {
      throw new DomainError('Course not enrolled');
    }

    const lesson = await this.lessonRepo.findOneBy({ id: values.lessonId });

    if (!lesson) {
      throw new DomainError('Lesson not found');
    }

    await this.completedLessonRepo.save({
      userId: values.userId,
      courseId: values.courseId,
      lessonId: values.lessonId,
      chapter: { id: lesson.chapterId },
    });
  }

  async deleteCompletedLesson(values: CompletedLessonUpdateDto): Promise<void> {
    const enrolled = await this.enrolledCourseRepo.existsBy({
      userId: values.userId,
      courseId: values.courseId,
    });

    if (!enrolled) {
      throw new DomainError('Course not enrolled');
    }

    const lessonExists = await this.lessonRepo.existsBy({
      id: values.lessonId,
    });

    if (!lessonExists) {
      throw new DomainError('Lesson not found');
    }

    await this.completedLessonRepo.delete({
      userId: values.userId,
      courseId: values.courseId,
      lessonId: values.lessonId,
    });
  }

  async countByUser(userId: string): Promise<number> {
    return await this.enrolledCourseRepo.countBy({ userId: userId });
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<EnrolledCourseDto | undefined> {
    const entity = await this.enrolledCourseRepo
      .createQueryBuilder('ec')
      .leftJoinAndSelect('ec.course', 'course')
      .leftJoinAndSelect('ec.resumeLesson', 'resumeLesson')
      .leftJoinAndSelect('ec.completedLessons', 'completedLesson')
      .where('ec.userId = :userId', { userId })
      .andWhere('ec.courseId = :courseId', { courseId })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .getOne();

    const dto = entity?.toDto();

    if (dto) {
      const lessonCount = await this.lessonRepo.countBy({ courseId: courseId });
      const completedCount = dto.completedLessons?.length ?? 0;

      const progress = (completedCount / lessonCount) * 100;
      dto.progress = isNaN(progress) ? 0 : Math.round(progress);
    }

    return dto;
  }

  async findEnrolledCourseLesson(
    userId: string,
    courseSlug: string,
    lessonSlug: string,
  ): Promise<LessonDto | undefined> {
    const entity = await this.lessonRepo
      .createQueryBuilder('lesson')
      .innerJoin(EnrolledCourseEntity, 'ec', 'lesson.courseId = ec.courseId')
      .leftJoin('lesson.course', 'course')
      .leftJoinAndSelect('lesson.chapter', 'chapter')
      .where('lesson.slug = :lessonSlug', { lessonSlug })
      .andWhere('ec.userId = :userId', { userId })
      .andWhere('course.slug = :courseSlug', { courseSlug })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .getOne();

    const dto = entity?.toDto();
    if (dto) {
      dto.completed = await this.completedLessonRepo.existsBy({
        lessonId: entity?.id,
      });
    }
    return dto;
  }

  async findByUserId(
    userId: string,
    query: QueryDto,
  ): Promise<PageDto<EnrolledCourseDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const { entities, raw } = await this.enrolledCourseRepo
      .createQueryBuilder('ec')
      .addSelect((qb) => {
        return qb
          .select('COUNT(lesson.id)')
          .from(LessonEntity, 'lesson')
          .where('ec.courseId = lesson.courseId');
      }, 'course_lesson_count')
      .leftJoinAndSelect('ec.course', 'course')
      .leftJoinAndSelect('ec.resumeLesson', 'resumeLesson')
      .leftJoinAndSelect('ec.completedLessons', 'completedLesson')
      .where('ec.userId = :userId', { userId })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('ec.createdAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawAndEntities();

    const count = await this.enrolledCourseRepo.countBy({ userId: userId });

    return PageDto.from({
      list: entities.map((e, i) => {
        const dto = e.toDto(true);
        const lessonCount = raw[i]['course_lesson_count'] ?? 0;
        const completedCount = e.completedLessons?.length ?? 0;

        const progress = (completedCount / lessonCount) * 100;
        dto.progress = isNaN(progress) ? 0 : Math.round(progress);
        return dto;
      }),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
