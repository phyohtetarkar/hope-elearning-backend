import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { CategoryEntity } from '@/core/entities/category.entity';
import { CourseAuthorEntity } from '@/core/entities/course-author.entity';
import { CourseMetaEntity } from '@/core/entities/course-meta.entity';
import { CourseEntity } from '@/core/entities/course.entity';
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

    const baseQuery = this.courseRepo.createQueryBuilder('course');
    // .leftJoinAndSelect('course.category', 'category')
    // .leftJoinAndSelect('course.meta', 'meta')
    // .leftJoinAndSelect('course.authors', 'course_author')
    // .leftJoinAndSelect('course_author.author', 'author');

    if (query.status) {
      baseQuery.andWhere('course.status = :status', { status: query.status });
    }

    if (query.access) {
      baseQuery.andWhere('course.access = :access', {
        access: query.access,
      });
    }

    if (query.level) {
      baseQuery.andWhere('course.level = :level', {
        level: query.level,
      });
    }

    if (query.featured) {
      baseQuery.andWhere('course.featured = :featured', {
        featured: query.featured,
      });
    }

    if (query.category) {
      baseQuery.andWhere('category.slug = :category', {
        category: query.category,
      });
    }

    if (query.author) {
      baseQuery.andWhere('course_author.authorId = :authorId', {
        authorId: query.author,
      });
    }

    if (query.q) {
      baseQuery.andWhere('LOWER(course.title) LIKE LOWER(:title)', {
        title: `%${query.q}%`,
      });
    }

    let orderBy = 'course.createdAt';
    if (query.orderBy === 'enrollment') {
      orderBy = 'meta.enrolledCount';
    } else if (query.orderBy === 'publishedAt') {
      orderBy = 'course.publishedAt';
    }

    baseQuery.orderBy(orderBy, 'DESC');

    const idQuery = baseQuery.clone();
    const dataQuery = baseQuery.clone();

    idQuery
      .leftJoin('course.category', 'category')
      .leftJoin('course.meta', 'meta')
      .leftJoin('course.authors', 'course_author');

    const count = await idQuery.getCount();

    idQuery.select(['course.id', orderBy]).distinct();

    idQuery.offset(offset).limit(limit);

    const idList = await idQuery.getMany();

    let list: CourseEntity[] = [];

    if (idList.length > 0) {
      dataQuery
        .andWhereInIds(idList.map((e) => e.id))
        .leftJoinAndSelect('course.category', 'category')
        .leftJoinAndSelect('course.meta', 'meta')
        .leftJoinAndSelect('course.authors', 'course_author')
        .leftJoinAndSelect('course_author.author', 'author');

      list = await dataQuery.getMany();
    }

    // const [list, count] = await baseQuery
    //   .offset(offset)
    //   .limit(limit)
    //   .getManyAndCount();

    return PageDto.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
