import { DomainError } from '@/common/errors';
import { BookmarkedCourseEntity } from '@/core/entities/bookmarked-course.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { CourseDto, CourseStatus, PageDto, QueryDto } from '@/core/models';
import { CourseBookmarkService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormCourseBookmarkService implements CourseBookmarkService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(BookmarkedCourseEntity)
    private bookmarkedCourseRepo: Repository<BookmarkedCourseEntity>,
  ) {}

  async add(userId: string, courseId: number): Promise<void> {
    const courseExists = await this.courseRepo.existsBy({
      id: courseId,
      status: CourseStatus.PUBLISHED,
    });

    if (!courseExists) {
      throw new DomainError('Course not found');
    }

    const exists = await this.bookmarkedCourseRepo.existsBy({
      userId: userId,
      courseId: courseId,
    });

    if (exists) {
      throw new DomainError('Course already bookmarked');
    }

    await this.bookmarkedCourseRepo.insert({
      userId: userId,
      courseId: courseId,
    });
  }

  async remove(userId: string, courseId: number): Promise<void> {
    await this.bookmarkedCourseRepo.delete({
      userId: userId,
      courseId: courseId,
    });
  }

  async existsByUserIdAndCourseId(
    userId: string,
    courseId: number,
  ): Promise<boolean> {
    return await this.bookmarkedCourseRepo.existsBy({
      userId: userId,
      courseId: courseId,
    });
  }

  async countByUser(userId: string): Promise<number> {
    return await this.bookmarkedCourseRepo.countBy({ userId: userId });
  }

  async findByUserId(
    userId: string,
    query: QueryDto,
  ): Promise<PageDto<CourseDto>> {
    const { limit, offset } = QueryDto.getPageable(query);
    const [entities, count] = await this.bookmarkedCourseRepo
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.course', 'course')
      .leftJoinAndSelect('course.meta', 'meta')
      .where('bookmark.userId = :userId', { userId })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('bookmark.createdAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    return PageDto.from({
      list: entities.map((e) => e.course.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
