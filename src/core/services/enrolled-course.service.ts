import {
  CompletedLessonUpdateDto,
  EnrollCourseDto,
  EnrolledCourseDto,
  PageDto,
  QueryDto,
  ResumeLessonUpdateDto,
} from '../models';

export interface EnrolledCourseService {
  enroll(values: EnrollCourseDto): Promise<void>;

  remove(values: EnrollCourseDto): Promise<void>;

  updateResumeLesson(values: ResumeLessonUpdateDto): Promise<void>;

  insertCompletedLesson(values: CompletedLessonUpdateDto): Promise<void>;

  findByUserId(
    userId: string,
    query: QueryDto,
  ): Promise<PageDto<EnrolledCourseDto>>;
}

export const ENROLLED_COURSE_SERVICE = 'EnrolledCourseService';
