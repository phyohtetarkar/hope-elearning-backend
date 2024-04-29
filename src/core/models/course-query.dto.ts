import { IsEnum, IsOptional } from 'class-validator';
import { CourseLevel, CourseStatus } from './course.dto';
import { QueryDto } from './query.dto';

export class CourseQueryDto extends QueryDto {
  q?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  category?: number;
  author?: string;

  constructor(partial: Partial<CourseQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
