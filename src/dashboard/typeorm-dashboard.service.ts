import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { PostEntity } from '@/core/entities/post.entity';
import { UserEntity } from '@/core/entities/user.entity';
import { DashboardDto } from '@/core/models';
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

  async getSummary(): Promise<DashboardDto> {
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
      return {
        ...prev,
        [cur['course_level']]: cur['course_level_count'],
      };
    }, {});

    // const monthlyEnrollmentList = await this.enrolledCourseRepo
    //   .createQueryBuilder('ec')
    //   .select([])
    //   .addSelect("DATE_TRUNC('month', ec.createdAt) AS enrolled_year_month")
    //   .addSelect('COUNT(*) AS enrolled_count')
    //   .groupBy('enrolled_year_month')
    //   .orderBy('enrolled_year_month')
    //   .getRawMany();

    return new DashboardDto({
      courseCount: courseCount,
      postCount: postCount,
      userCount: userCount,
      subscriberCount: 0,
      monthlyEnrollments: {},
      enrolledByLevel: {
        beginner: enrolledByLevel['beginner'] ?? 4,
        intermediate: enrolledByLevel['intermediate'] ?? 10,
        advanced: enrolledByLevel['advanced'] ?? 2,
      },
    });
  }
}
