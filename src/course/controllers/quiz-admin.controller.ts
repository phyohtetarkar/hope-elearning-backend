import { Staff } from '@/common/decorators';
import { QuizUpdateDto, SortUpdateDto } from '@/core/models';
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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CourseOwnerGuard } from '../guards/course-owner.guard';

@ApiTags('Course')
@Controller('/admin/courses/:courseId')
@UseGuards(CourseOwnerGuard)
@Staff()
export class QuizAdminController {
  constructor(@Inject(QUIZ_SERVICE) private quizService: QuizService) {}

  @Post('quizzes')
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() values: QuizUpdateDto,
  ) {
    return await this.quizService.create({
      ...values,
      courseId: courseId,
    });
  }

  @Put('quizzes')
  async update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() values: QuizUpdateDto,
  ) {
    return await this.quizService.update({
      ...values,
      courseId: courseId,
    });
  }

  @ApiBody({
    type: SortUpdateDto,
    isArray: true,
  })
  @UseGuards(CourseOwnerGuard)
  @Put('sort-quizzes')
  async sortQuizzes(@Body() values: SortUpdateDto[]) {
    await this.quizService.updateSort(values);
  }

  @Delete('quizzes/:quizId')
  async delete(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('quizId', ParseIntPipe) quizId: number,
  ) {
    await this.quizService.delete(quizId, courseId);
  }
}
