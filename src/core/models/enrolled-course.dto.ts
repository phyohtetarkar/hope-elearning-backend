import { CourseDto } from './course.dto';

export class EnrolledCourseDto {
  course: CourseDto;
  completedLessons: string[];

  constructor(partial: Partial<EnrolledCourseDto> = {}) {
    Object.assign(this, partial);
  }
}
