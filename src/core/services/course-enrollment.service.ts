import {
  CompletedLessonUpdateDto,
  EnrolledCourseDto,
  LessonDto,
  PageDto,
  QueryDto,
  ResumeLessonUpdateDto,
} from '../models';

export interface CourseEnrollmentService {
  enroll(userId: string, courseId: number): Promise<void>;

  remove(userId: string, courseId: number): Promise<void>;

  updateResumeLesson(values: ResumeLessonUpdateDto): Promise<void>;

  insertCompletedLesson(values: CompletedLessonUpdateDto): Promise<void>;

  deleteCompletedLesson(values: CompletedLessonUpdateDto): Promise<void>;

  countByUser(userId: string): Promise<number>;

  findByUserIdAndCourseId(
    userId: string,
    courseId: number,
  ): Promise<EnrolledCourseDto | undefined>;

  findEnrolledCourseLesson(
    userId: string,
    slug: string,
  ): Promise<LessonDto | undefined>;

  findByUserId(
    userId: string,
    query: QueryDto,
  ): Promise<PageDto<EnrolledCourseDto>>;
}

export const COURSE_ENROLLMENT_SERVICE = 'CourseEnrollmentService';
