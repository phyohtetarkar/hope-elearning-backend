import {
  CompletedLessonUpdateDto,
  EnrolledCourseDto,
  LessonDto,
  PageDto,
  QueryDto,
  ResumeLessonUpdateDto,
} from '../models';

export interface CourseEnrollmentService {
  enroll(userId: string, courseId: string): Promise<void>;

  remove(userId: string, courseId: string): Promise<void>;

  updateResumeLesson(values: ResumeLessonUpdateDto): Promise<void>;

  insertCompletedLesson(values: CompletedLessonUpdateDto): Promise<void>;

  deleteCompletedLesson(values: CompletedLessonUpdateDto): Promise<void>;

  findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<EnrolledCourseDto | undefined>;

  findEnrolledCourseLesson(
    userId: string,
    courseSlug: string,
    lessonSlug: string,
  ): Promise<LessonDto | undefined>;

  findByUserId(
    userId: string,
    query: QueryDto,
  ): Promise<PageDto<EnrolledCourseDto>>;
}

export const COURSE_ENROLLMENT_SERVICE = 'CourseEnrollmentService';
