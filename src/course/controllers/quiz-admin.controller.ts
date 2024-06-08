import { Staff } from '@/common/decorators';
import { QuizUpdateDto } from '@/core/models';
import { QUIZ_SERVICE, QuizService } from '@/core/services';
import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseOwnerGuard } from '../guards/course-owner.guard';

@ApiTags('Course')
@Controller('/admin/courses/:courseId/quizzes')
@UseGuards(CourseOwnerGuard)
@Staff()
export class QuizAdminController {
  constructor(@Inject(QUIZ_SERVICE) private quizService: QuizService) {}

  @Post()
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() values: QuizUpdateDto,
  ) {
    return await this.quizService.create({
      ...values,
      courseId: courseId,
    });
  }

  @Put()
  async update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() values: QuizUpdateDto,
  ) {
    return await this.quizService.update({
      ...values,
      courseId: courseId,
    });
  }

  @Delete(':quizId')
  async delete(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('quizId', ParseIntPipe) quizId: number,
  ) {
    await this.quizService.delete(quizId, courseId);
  }
}
