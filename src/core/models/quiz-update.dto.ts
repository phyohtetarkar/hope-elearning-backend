import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { QuizDto } from './quiz.dto';

export class QuizUpdateDto {
  @IsNumber()
  lessonId: number;

  @ApiHideProperty()
  @Exclude()
  courseId: number;

  @IsNotEmpty()
  quiz: QuizDto;
}
