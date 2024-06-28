import { AuditingDto } from './auditing.dto';
import { UserDto } from './user.dto';

export class CourseReviewDto {
  rating: number;

  message?: string;

  user: UserDto;

  audit: AuditingDto;

  constructor(partial: Partial<CourseReviewDto> = {}) {
    Object.assign(this, partial);
  }
}
