import { CourseAuthorEntity } from '@/core/entities/course-author.entity';
import { CourseAuthorService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormCourseAuthorService implements CourseAuthorService {
  constructor(
    @InjectRepository(CourseAuthorEntity)
    private courseAuthorRepo: Repository<CourseAuthorEntity>,
  ) {}

  async existByCourseAndAuthor(
    courseId: number,
    authorId: string,
  ): Promise<boolean> {
    return await this.courseAuthorRepo.existsBy({
      courseId: courseId,
      authorId: authorId,
    });
  }
}
