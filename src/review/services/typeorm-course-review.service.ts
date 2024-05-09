import { DomainError } from '@/common/errors';
import { CourseMetaEntity } from '@/core/entities/course-meta.entity';
import { CourseReviewEntity } from '@/core/entities/course-review.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import {
  CourseReviewDto,
  CourseReviewUpdateDto,
  CourseStatus,
  PageDto,
  QueryDto,
} from '@/core/models';
import { CourseReviewService } from '@/core/services/course-review.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormCourseReviewService implements CourseReviewService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseReviewEntity)
    private courseReviewRepo: Repository<CourseReviewEntity>,
  ) {}

  async save(values: CourseReviewUpdateDto): Promise<void> {
    const courseExists = await this.courseRepo.existsBy({
      id: values.courseId,
      status: CourseStatus.PUBLISHED,
    });

    if (!courseExists) {
      throw new DomainError('Course not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.save(CourseReviewEntity, {
        userId: values.userId,
        courseId: values.courseId,
        rating: values.rating,
        message: values.message,
      });

      await em
        .createQueryBuilder()
        .update(CourseMetaEntity, {
          rating: () =>
            `SELECT AVG(review.rating) FROM course_review review WHERE review.course_id = ${values.courseId}`,
          ratingCount: () => 'rating_count + 1',
        })
        .where('id = :id', { id: values.courseId })
        .execute();
    });
  }

  async remove(userId: string, courseId: string): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.delete(CourseReviewEntity, {
        userId: userId,
        courseId: courseId,
      });

      await em
        .createQueryBuilder()
        .update(CourseMetaEntity, {
          rating: () =>
            `SELECT AVG(review.rating) FROM course_review review WHERE review.course_id = ${courseId}`,
          ratingCount: () => 'rating_count - 1',
        })
        .where('id = :id', { id: courseId })
        .execute();
    });
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<CourseReviewDto | undefined> {
    const entity = await this.courseReviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.userId = :userId', { userId })
      .andWhere('review.courseId = :courseId', { courseId })
      .getOne();

    return entity?.toDto();
  }

  async findByCourseId(
    courseId: string,
    query: QueryDto,
  ): Promise<PageDto<CourseReviewDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const [entities, count] = await this.courseReviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.courseId = :courseId', { courseId })
      .orderBy('ec.createdAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    return PageDto.from({
      list: entities.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
