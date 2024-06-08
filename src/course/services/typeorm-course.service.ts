import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { BookmarkedCourseEntity } from '@/core/entities/bookmarked-course.entity';
import { CategoryEntity } from '@/core/entities/category.entity';
import { ChapterEntity } from '@/core/entities/chapter.entity';
import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';
import { CourseAuthorEntity } from '@/core/entities/course-author.entity';
import { CourseMetaEntity } from '@/core/entities/course-meta.entity';
import { CourseReviewEntity } from '@/core/entities/course-review.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { LessonRevisionEntity } from '@/core/entities/lesson-revision.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import { AuditEvent } from '@/core/events';
import {
  CourseCreateDto,
  CourseDto,
  CourseQueryDto,
  CourseStatus,
  CourseUpdateDto,
  PageDto,
  QueryDto,
} from '@/core/models';
import { CourseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormCourseService implements CourseService {
  constructor(
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
  ) {}

  async create(values: CourseCreateDto): Promise<number> {
    if (
      !(await this.categoryRepo.existsBy({
        id: values.categoryId,
      }))
    ) {
      throw new DomainError('Category not found');
    }

    if (values.authors.length === 0) {
      throw new DomainError('Required at least one author');
    }

    const courseId = await this.dataSource.transaction(async (em) => {
      const result = await em.insert(CourseEntity, {
        title: values.title,
        level: values.level,
        category: { id: values.categoryId },
        slug: await normalizeSlug({
          value: values.slug,
          exists: (v) => {
            return em.existsBy(CourseEntity, { slug: v });
          },
        }),
      });

      const courseId = result.identifiers[0].id;

      const courseAuthors = values.authors.map((id, i) => {
        return {
          authorId: id,
          courseId: courseId,
          sortOrder: i,
        } as CourseAuthorEntity;
      });

      await em.insert(CourseAuthorEntity, courseAuthors);

      await em.insert(CourseMetaEntity, {
        id: courseId,
      });

      return courseId;
    });

    this.eventEmitter.emit(
      'audit.created',
      new AuditEvent({
        resourceId: `${courseId}`,
        resourceType: 'course',
        context: JSON.stringify({ title: values.title }),
      }),
    );

    return courseId;
  }

  async update(values: CourseUpdateDto): Promise<void> {
    if (
      !(await this.categoryRepo.existsBy({
        id: values.categoryId,
      }))
    ) {
      throw new DomainError('Category not found');
    }

    const courseId = values.id;
    const entity = await this.courseRepo.findOneBy({ id: courseId });

    if (!entity) {
      throw new DomainError('Course not found');
    }

    const dbUpdatedAt = new Date(entity.updatedAt).getTime();
    const userUpdatedAt = new Date(values.updatedAt).getTime();

    if (dbUpdatedAt > userUpdatedAt) {
      throw new DomainError('Update conflict by another user. Please refresh.');
    }

    await this.dataSource.transaction(async (em) => {
      await em.update(CourseEntity, courseId, {
        title: values.title,
        cover: values.cover ?? null,
        excerpt: values.excerpt,
        description: values.description,
        access: values.access,
        level: values.level,
        category: { id: values.categoryId },
        slug:
          entity.slug !== values.slug
            ? await normalizeSlug({
                value: values.slug,
                exists: (v) => {
                  return em.existsBy(CourseEntity, { slug: v });
                },
              })
            : undefined,
      });

      if (values.authors) {
        const courseAuthors = values.authors.map((id, i) => {
          return {
            authorId: id,
            courseId: courseId,
            sortOrder: i,
          } as CourseAuthorEntity;
        });

        await em.delete(CourseAuthorEntity, { courseId: courseId });
        await em.insert(CourseAuthorEntity, courseAuthors);
      }
    });

    this.eventEmitter.emit(
      'audit.updated',
      new AuditEvent({
        resourceId: `${courseId}`,
        resourceType: 'course',
        context: JSON.stringify({ title: values.title }),
      }),
    );
  }

  async publish(userId: string, courseId: number): Promise<void> {
    const entity = await this.courseRepo.findOneBy({ id: courseId });
    if (!entity) {
      throw new DomainError('Course not found');
    }

    const now = new Date();
    now.setMilliseconds(0);

    this.courseRepo.update(courseId, {
      status: CourseStatus.PUBLISHED,
      publishedBy: userId,
      publishedAt: entity.publishedAt ?? now,
    });
  }

  async unpublish(courseId: number): Promise<void> {
    const exists = await this.courseRepo.existsBy({ id: courseId });
    if (!exists) {
      throw new DomainError('Course not found');
    }

    this.courseRepo.update(courseId, {
      status: CourseStatus.DRAFT,
    });
  }

  async delete(id: number): Promise<void> {
    const entity = await this.courseRepo.findOneBy({ id: id });

    if (!entity) {
      throw new DomainError('Course not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.delete(CompletedLessonEntity, { courseId: id });
      await em.delete(EnrolledCourseEntity, { courseId: id });
      await em.delete(BookmarkedCourseEntity, { courseId: id });
      await em.delete(CourseReviewEntity, { courseId: id });
      await em
        .createQueryBuilder(LessonRevisionEntity, 'lesson_revision')
        .innerJoin('lesson_revision.lesson', 'lesson')
        .innerJoin('lesson.chapter', 'chapter')
        .innerJoin('chapter.course', 'course')
        .where('course.id = :id', { id })
        .getMany()
        .then((entities) => {
          if (entities.length === 0) return;
          return em.delete(
            LessonRevisionEntity,
            entities.map((en) => {
              return {
                lessonId: en.lessonId,
              };
            }),
          );
        });

      await em
        .createQueryBuilder(LessonEntity, 'lesson')
        .innerJoin('lesson.chapter', 'chapter')
        .innerJoin('chapter.course', 'course')
        .where('course.id = :id', { id })
        .getMany()
        .then((entities) => {
          if (entities.length === 0) return;
          return em.delete(
            LessonEntity,
            entities.map((en) => en.id),
          );
        });

      await em.delete(ChapterEntity, { course: { id } });
      await em.delete(CourseAuthorEntity, { courseId: id });
      await em.delete(CourseMetaEntity, id);
      await em.delete(CourseEntity, id);
    });

    this.eventEmitter.emit(
      'audit.deleted',
      new AuditEvent({
        resourceId: `${id}`,
        resourceType: 'course',
        context: JSON.stringify({ title: entity.title }),
      }),
    );
  }

  async findById(id: number): Promise<CourseDto | undefined> {
    const entity = await this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.meta', 'meta')
      .leftJoinAndSelect('course.authors', 'course_author')
      .leftJoinAndSelect('course_author.author', 'author')
      .leftJoinAndSelect('course.chapters', 'chapter')
      .leftJoinAndSelect('chapter.lessons', 'lesson')
      .where('course.id = :id', { id })
      .getOne();

    return entity?.toDto();
  }

  async findBySlug(slug: string): Promise<CourseDto | undefined> {
    const entity = await this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.meta', 'meta')
      .leftJoinAndSelect('course.authors', 'course_author')
      .leftJoinAndSelect('course_author.author', 'author')
      .leftJoinAndSelect('course.chapters', 'chapter')
      .leftJoinAndSelect('chapter.lessons', 'lesson')
      .where('course.slug = :slug', { slug })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .getOne();

    return entity?.toDto();
  }

  async findRelated(slug: string, limit: number): Promise<CourseDto[]> {
    const entities = await this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.meta', 'meta')
      .leftJoinAndSelect('course.authors', 'course_author')
      .leftJoinAndSelect('course_author.author', 'author')
      .where('course.slug != :slug', { slug })
      .andWhere(
        'course.category_id = (SELECT category_id FROM el_course WHERE slug = :slug)',
        { slug },
      )
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .limit(limit)
      .getMany();

    return entities.map((e) => e.toDto());
  }

  async find(query: CourseQueryDto): Promise<PageDto<CourseDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const courseQuery = this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.meta', 'meta')
      .leftJoinAndSelect('course.authors', 'course_author')
      .leftJoinAndSelect('course_author.author', 'author');

    if (query.status) {
      courseQuery.andWhere('course.status = :status', { status: query.status });
    }

    if (query.access) {
      courseQuery.andWhere('course.access = :access', {
        access: query.access,
      });
    }

    if (query.level) {
      courseQuery.andWhere('course.level = :level', {
        level: query.level,
      });
    }

    if (query.featured) {
      courseQuery.andWhere('course.featured = :featured', {
        featured: query.featured,
      });
    }

    if (query.category) {
      courseQuery.andWhere('category.slug = :category', {
        category: query.category,
      });
    }

    if (query.author) {
      courseQuery.andWhere('course_author.authorId = :authorId', {
        authorId: query.author,
      });
    }

    if (query.q) {
      courseQuery.andWhere('LOWER(course.title) LIKE LOWER(:title)', {
        title: `%${query.q}%`,
      });
    }

    if (query.orderBy === 'enrollment') {
      courseQuery.orderBy(`meta.enrolledCount`, 'DESC');
    } else if (query.orderBy === 'publishedAt') {
      courseQuery.orderBy(`course.publishedAt`, 'DESC');
    } else {
      courseQuery.orderBy(`course.createdAt`, 'DESC');
    }

    const [list, count] = await courseQuery
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    return PageDto.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
