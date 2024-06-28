export class CourseMetaDto {
  rating: string;

  ratingCount: string;

  enrolledCount: string;

  constructor(partial: Partial<CourseMetaDto> = {}) {
    Object.assign(this, partial);
  }
}
