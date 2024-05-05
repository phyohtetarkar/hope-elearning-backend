export interface CourseAuthorService {
  existByCourseAndAuthor(courseId: string, authorId: string): Promise<boolean>;
}

export const COURSE_AUTHOR_SERVICE = 'CourseAuthorService';
