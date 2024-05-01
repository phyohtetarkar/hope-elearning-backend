export class CourseMetaDto {
  rating: string;

  ratingCount: string;

  enrolledCount: string;

  chapterCount: number;

  lessonCount: number;

  constructor(partial: Partial<CourseMetaDto> = {}) {
    Object.assign(this, partial);
  }
}
