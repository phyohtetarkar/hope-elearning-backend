import { DomainError } from '@/common/errors';
import { BookmarkedCourseEntity } from '@/core/entities/bookmarked-course.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { CourseDto, CourseStatus, PageDto, QueryDto } from '@/core/models';
import { BookmarkCourseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormBookmarkCourseService implements BookmarkCourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(BookmarkedCourseEntity)
    private bookmarkedCourseRepo: Repository<BookmarkedCourseEntity>,
  ) {}

  async add(userId: string, courseId: string): Promise<void> {
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

  async remove(userId: string, courseId: string): Promise<void> {
    await this.bookmarkedCourseRepo.delete({
      userId: userId,
      courseId: courseId,
    });
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<CourseDto | undefined> {
    const entity = await this.bookmarkedCourseRepo
      .createQueryBuilder('bc')
      .leftJoinAndSelect('bc.course', 'course')
      .where('bc.userId = :userId', { userId })
      .andWhere('bc.courseId = :courseId', { courseId })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .getOne();

    const dto = entity?.course.toDto();

    return dto;
  }

  async findByUserId(
    userId: string,
    query: QueryDto,
  ): Promise<PageDto<CourseDto>> {
    const { limit, offset } = QueryDto.getPageable(query);
    const { entities, raw } = await this.bookmarkedCourseRepo
      .createQueryBuilder('bc')
      .leftJoinAndSelect('bc.course', 'course')
      .where('bc.userId = :userId', { userId })
      .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
      .orderBy('bc.createdAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawAndEntities();

    const count = await this.bookmarkedCourseRepo.countBy({ userId: userId });

    return PageDto.from({
      list: entities.map((e, i) => {
        const dto = e.course.toDto(true);
        return dto;
      }),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
