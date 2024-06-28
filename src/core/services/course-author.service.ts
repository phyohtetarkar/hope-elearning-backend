export interface CourseAuthorService {
  existByCourseAndAuthor(courseId: number, authorId: string): Promise<boolean>;
}

export const COURSE_AUTHOR_SERVICE = 'CourseAuthorService';
