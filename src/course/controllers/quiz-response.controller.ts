import { QuizResponseCreateDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { QUIZ_RESPONSE_SERVICE, QuizResponseService } from '@/core/services';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Course')
@Controller('/quiz-responses')
export class QuizResponseController {
  constructor(
    private security: SecurityContextService,
    @Inject(QUIZ_RESPONSE_SERVICE)
    private quizResponseService: QuizResponseService,
  ) {}

  @Get(':lessonId')
  async findByLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
    const userId = this.security.getAuthenticatedUser().id;
    return await this.quizResponseService.findByLesson(userId, lessonId);
  }

  @Post(':lessonId')
  async create(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() values: QuizResponseCreateDto[],
  ) {
    const userId = this.security.getAuthenticatedUser().id;
    return await this.quizResponseService.create(userId, lessonId, values);
  }

  @Delete(':lessonId')
  async delete(@Param('lessonId', ParseIntPipe) lessonId: number) {
    const userId = this.security.getAuthenticatedUser().id;
    await this.quizResponseService.deleteByLesson(userId, lessonId);
  }
}
