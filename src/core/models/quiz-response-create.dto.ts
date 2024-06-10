import { IsNumber, IsOptional } from 'class-validator';

export class QuizResponseCreateDto {
  @IsNumber()
  quizId: number;

  @IsNumber()
  answerId: number;

  @IsOptional()
  shortAnswer?: string;
}
