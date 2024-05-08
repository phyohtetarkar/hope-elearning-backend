import {
  CompletedLessonUpdateDto,
  EnrolledCourseDto,
  PageDto,
  QueryDto,
  ResumeLessonUpdateDto,
} from '../models';

export interface EnrollCourseService {
  enroll(userId: string, courseId: string): Promise<void>;

  remove(userId: string, courseId: string): Promise<void>;

  updateResumeLesson(values: ResumeLessonUpdateDto): Promise<void>;

  insertCompletedLesson(values: CompletedLessonUpdateDto): Promise<void>;

  findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<EnrolledCourseDto | undefined>;

  findByUserId(
    userId: string,
    query: QueryDto,
  ): Promise<PageDto<EnrolledCourseDto>>;
}

export const ENROLL_COURSE_SERVICE = 'EnrollCourseService';
