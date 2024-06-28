import { DomainError } from '@/common/errors';
import { LessonEntity } from '@/core/entities/lesson.entity';
import { QuizResponseEntity } from '@/core/entities/quiz-response.entity';
import { QuizEntity } from '@/core/entities/quiz.entity';
import {
  LessonType,
  QuizResponseCreateDto,
  QuizResponseDto,
} from '@/core/models';
import { QuizResponseService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormQuizResponseService implements QuizResponseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(LessonEntity)
    private lessonRepo: Repository<LessonEntity>,
    @InjectRepository(QuizResponseEntity)
    private quizResponseRepo: Repository<QuizResponseEntity>,
  ) {}

  async create(
    userId: string,
    lessonId: number,
    responses: QuizResponseCreateDto[],
  ): Promise<QuizResponseDto[]> {
    const lessonExists = await this.lessonRepo.existsBy({
      id: lessonId,
      type: LessonType.QUIZ,
    });

    if (!lessonExists) {
      throw new DomainError('Lesson not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.delete(QuizResponseEntity, {
        userId: userId,
        lessonId: lessonId,
      });

      const entities: QuizResponseEntity[] = [];

      for (const resp of responses) {
        const quizExists = await em.existsBy(QuizEntity, { id: resp.quizId });
        if (!quizExists) {
          continue;
        }

        entities.push(
          new QuizResponseEntity({
            userId: userId,
            lessonId: lessonId,
            quizId: resp.quizId,
            answerId: resp.answerId,
            shortAnswer: resp.shortAnswer,
          }),
        );
      }

      await em.insert(QuizResponseEntity, entities);
    });

    return await this.findByLesson(userId, lessonId);
  }

  async deleteByLesson(userId: string, lessonId: number): Promise<void> {
    await this.quizResponseRepo.delete({ userId: userId, lessonId: lessonId });
  }

  async findByLesson(
    userId: string,
    lessonId: number,
  ): Promise<QuizResponseDto[]> {
    const entities = await this.quizResponseRepo
      .createQueryBuilder('qr')
      .leftJoinAndSelect('qr.answer', 'answer')
      .where('qr.userId = :userId', { userId })
      .andWhere('qr.lessonId = :lessonId', { lessonId })
      .orderBy('qr.createdAt', 'ASC')
      .getMany();

    return entities.map((en) => en.toDto());
  }
}
