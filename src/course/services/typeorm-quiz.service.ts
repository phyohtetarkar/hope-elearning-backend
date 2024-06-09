import { DomainError } from '@/common/errors';
import { LessonEntity } from '@/core/entities/lesson.entity';
import { QuizAnswerEntity } from '@/core/entities/quiz-answer.entity';
import { QuizEntity } from '@/core/entities/quiz.entity';
import { QuizDto, QuizUpdateDto, SortUpdateDto } from '@/core/models';
import { QuizService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormQuizService implements QuizService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(LessonEntity)
    private lessonRepo: Repository<LessonEntity>,
    @InjectRepository(QuizEntity)
    private quizRepo: Repository<QuizEntity>,
  ) {}

  async create(values: QuizUpdateDto): Promise<QuizDto> {
    const exists = await this.lessonRepo
      .createQueryBuilder('lesson')
      .leftJoin('lesson.chapter', 'chapter')
      .where('lesson.id = :id', { id: values.lessonId })
      .andWhere('chapter.course_id = :courseId', { courseId: values.courseId })
      .getExists();

    if (!exists) {
      throw new DomainError('Lesson not found');
    }

    const quizId = await this.dataSource.transaction(async (em) => {
      const result = await em.insert(QuizEntity, {
        question: values.quiz.question,
        type: values.quiz.type,
        feedback: values.quiz.feedback,
        sortOrder: values.quiz.sortOrder,
        lesson: { id: values.lessonId },
      });

      const quizId = result.identifiers[0].id;

      for (const answer of values.quiz.answers) {
        await em.insert(QuizAnswerEntity, {
          answer: answer.answer,
          correct: answer.correct,
          sortOrder: answer.sortOrder,
          quiz: { id: quizId },
        });
      }

      return quizId;
    });

    const quiz = await this.findById(quizId);

    if (!quiz) {
      throw new DomainError('Quiz not found');
    }

    return quiz;
  }

  async update(values: QuizUpdateDto): Promise<QuizDto> {
    const exists = await this.quizRepo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.lesson', 'lesson')
      .leftJoin('lesson.chapter', 'chapter')
      .where('quiz.id = :quizId', { quizId: values.quiz.id })
      .andWhere('lesson.id = :lessonId', { lessonId: values.lessonId })
      .andWhere('chapter.course_id = :courseId', { courseId: values.courseId })
      .getExists();

    if (!exists) {
      throw new DomainError('Quiz not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.update(QuizEntity, values.quiz.id, {
        question: values.quiz.question,
        feedback: values.quiz.feedback,
        sortOrder: values.quiz.sortOrder,
      });

      for (const answer of values.quiz.answers) {
        if (answer.deleted) {
          await em.delete(QuizAnswerEntity, answer.id);
        } else if (answer.id > 0) {
          await em.update(QuizAnswerEntity, answer.id, {
            answer: answer.answer,
            correct: answer.correct,
            sortOrder: answer.sortOrder,
          });
        } else {
          await em.insert(QuizAnswerEntity, {
            answer: answer.answer,
            correct: answer.correct,
            sortOrder: answer.sortOrder,
            quiz: { id: values.quiz.id },
          });
        }
      }
    });

    const quiz = await this.findById(values.quiz.id);

    if (!quiz) {
      throw new DomainError('Quiz not found');
    }

    return quiz;
  }

  async updateSort(values: SortUpdateDto[]): Promise<void> {
    if (values.length === 0) return;

    await this.dataSource.transaction(async (em) => {
      for (const v of values) {
        await em
          .createQueryBuilder()
          .update(QuizEntity, {
            sortOrder: v.sortOrder,
          })
          .where('id = :id', { id: v.id })
          .callListeners(false)
          .execute();
      }
    });
  }

  async delete(quizId: number, courseId: number): Promise<void> {
    const exists = await this.quizRepo
      .createQueryBuilder('quiz')
      .leftJoin('quiz.lesson', 'lesson')
      .leftJoin('lesson.chapter', 'chapter')
      .where('quiz.id = :quizId', { quizId: quizId })
      .andWhere('chapter.course_id = :courseId', { courseId: courseId })
      .getExists();

    if (!exists) {
      throw new DomainError('Quiz not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.delete(QuizEntity, quizId);
    });
  }

  async findById(id: number): Promise<QuizDto | undefined> {
    const entity = await this.quizRepo
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.answers', 'answer')
      .where('quiz.id = :id', { id })
      .getOne();

    return entity?.toDto();
  }
}
