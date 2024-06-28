import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { PostEntity } from '@/core/entities/post.entity';
import { UserEntity } from '@/core/entities/user.entity';
import { MonthlyEnrollmentDto, SummaryDto } from '@/core/models';
import { DashboardService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormDashboardService implements DashboardService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(EnrolledCourseEntity)
    private enrolledCourseRepo: Repository<EnrolledCourseEntity>,
  ) {}

  async getSummary(): Promise<SummaryDto> {
    const courseCount = await this.courseRepo.count();
    const postCount = await this.postRepo.count();
    const userCount = await this.userRepo.count();

    const enrolledByLevelList = await this.courseRepo
      .createQueryBuilder('course')
      .select(['course.level'])
      .addSelect('COUNT(course.level) AS course_level_count')
      .innerJoin(EnrolledCourseEntity, 'ec', 'course.id = ec.courseId')
      .groupBy('course.level')
      .getRawMany();

    const enrolledByLevel = enrolledByLevelList.reduce((prev, cur) => {
      const count = cur['course_level_count'];
      return {
        ...prev,
        [cur['course_level']]: count ? Number(count) : 0,
      };
    }, {});

    return new SummaryDto({
      courseCount: courseCount,
      postCount: postCount,
      userCount: userCount,
      subscriberCount: 0,
      enrolledByLevel: {
        beginner: enrolledByLevel['beginner'] ?? 0,
        intermediate: enrolledByLevel['intermediate'] ?? 0,
        advanced: enrolledByLevel['advanced'] ?? 0,
      },
    });
  }

  async getMonthlyEnrollments(year: number): Promise<MonthlyEnrollmentDto> {
    const monthlyEnrollmentList = await this.enrolledCourseRepo
      .createQueryBuilder('ec')
      .select([])
      .addSelect('EXTRACT(YEAR FROM ec.createdAt) AS enrolled_year')
      .addSelect('EXTRACT(MONTH FROM ec.createdAt) AS enrolled_month')
      .addSelect('COUNT(*) AS enrolled_count')
      .where('EXTRACT(YEAR FROM ec.createdAt) = :year', { year })
      .groupBy('enrolled_year')
      .addGroupBy('enrolled_month')
      .orderBy('enrolled_month')
      .getRawMany();

    const monthlyEnrollments = monthlyEnrollmentList.reduce((prev, cur) => {
      const count = cur['enrolled_count'];
      return {
        ...prev,
        [cur['enrolled_month']]: count ? Number(count) : 0,
      };
    }, {});

    return new MonthlyEnrollmentDto({ data: monthlyEnrollments });
  }
}
