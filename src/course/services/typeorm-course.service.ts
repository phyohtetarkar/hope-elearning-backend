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
import {
  CourseCreateDto,
  CourseDto,
  CourseQueryDto,
  CourseStatus,
  CourseUpdateDto,
  LessonStatus,
  PageDto,
  QueryDto,
} from '@/core/models';
import { CourseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormCourseService implements CourseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
  ) {}

  async create(values: CourseCreateDto): Promise<string> {
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

    return await this.dataSource.transaction(async (em) => {
      const result = await em.insert(CourseEntity, {
        title: values.title,
        level: values.level,
        category: { id: values.categoryId },
        slug: await normalizeSlug(values.slug, (v) => {
          return em.existsBy(CourseEntity, { slug: v });
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
        excerpt: values.excerpt ?? null,
        description: values.description ?? null,
        access: values.access,
        level: values.level,
        category: { id: values.categoryId },
        slug:
          entity.slug !== values.slug
            ? await normalizeSlug(values.slug, (v) => {
                return em.existsBy(CourseEntity, { slug: v });
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
  }

  async publish(userId: string, courseId: string): Promise<void> {
    const entity = await this.courseRepo.findOneBy({ id: courseId });
    if (!entity) {
      throw new DomainError('Course not found');
    }

    const now = new Date();
    now.setMilliseconds(0);

    await this.dataSource.transaction(async (em) => {
      await em.update(CourseEntity, courseId, {
        status: CourseStatus.PUBLISHED,
        publishedBy: userId,
        publishedAt: entity.publishedAt ?? now,
      });

      await em.update(
        LessonEntity,
        { courseId: courseId },
        {
          status: LessonStatus.PUBLISHED,
        },
      );
    });
  }

  async unpublish(courseId: string): Promise<void> {
    const exists = await this.courseRepo.existsBy({ id: courseId });
    if (!exists) {
      throw new DomainError('Course not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.update(CourseEntity, courseId, {
        status: CourseStatus.DRAFT,
      });

      await em.update(
        LessonEntity,
        { courseId: courseId },
        {
          status: LessonStatus.DRAFT,
        },
      );
    });
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.delete(CompletedLessonEntity, { courseId: id });
      await em.delete(EnrolledCourseEntity, { courseId: id });
      await em.delete(BookmarkedCourseEntity, { courseId: id });
      await em.delete(CourseReviewEntity, { courseId: id });
      await em.delete(LessonRevisionEntity, { course: { id } });
      await em.delete(LessonEntity, { course: { id } });
      await em.delete(ChapterEntity, { course: { id } });
      await em.delete(CourseAuthorEntity, { courseId: id });
      await em.delete(CourseMetaEntity, id);
      await em.delete(CourseEntity, id);
    });
  }

  async findById(id: string): Promise<CourseDto | undefined> {
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
      .getOne();

    return entity?.toDto();
  }

  async find(query: CourseQueryDto): Promise<PageDto<CourseDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const postQuery = this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.meta', 'meta')
      .leftJoinAndSelect('course.authors', 'course_author')
      .leftJoinAndSelect('course_author.author', 'author');

    if (query.status) {
      postQuery.andWhere('course.status = :status', { status: query.status });
    }

    if (query.access) {
      postQuery.andWhere('course.access = :access', {
        access: query.access,
      });
    }

    if (query.level) {
      postQuery.andWhere('course.level = :level', {
        level: query.level,
      });
    }

    if (query.featured) {
      postQuery.andWhere('course.featured = :featured', {
        featured: query.featured,
      });
    }

    if (query.category) {
      postQuery.andWhere('course.category_id = :categoryId', {
        categoryId: query.category,
      });
    }

    if (query.author) {
      postQuery.andWhere('course_author.authorId = :authorId', {
        authorId: query.author,
      });
    }

    if (query.q) {
      postQuery.andWhere('LOWER(course.title) LIKE LOWER(:title)', {
        title: `%${query.q}%`,
      });
    }

    const [list, count] = await postQuery
      .orderBy(`course.createdAt`, 'DESC')
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