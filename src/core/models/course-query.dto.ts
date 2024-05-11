import { IsEnum, IsOptional } from 'class-validator';
import { CourseAccess, CourseLevel, CourseStatus } from './course.dto';
import { QueryDto } from './query.dto';

export class CourseQueryDto extends QueryDto {
  q?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseAccess)
  access?: CourseAccess;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  category?: number;
  author?: string;

  featured?: boolean;

  orderBy?: 'enrollment' | 'publishedAt';

  constructor(partial: Partial<CourseQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
