import { ApiOkResponsePaginated, Staff } from '@/common/decorators';
import {
  CourseCreateDto,
  CourseDto,
  CourseQueryDto,
  CourseUpdateDto,
  SortUpdateDto,
  UserRole,
} from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  CHAPTER_SERVICE,
  COURSE_SERVICE,
  ChapterService,
  CourseService,
  LESSON_SERVICE,
  LessonService,
} from '@/core/services';
import {
  FILE_STORAGE_SERVICE,
  FileStorageService,
} from '@/core/storage/file-storage.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CourseOwnerGuard } from '../guards/course-owner.guard';
import { CourseCreateTransformPipe } from '../pipes/course-create-transform.pipe';
import { CourseQueryTransformPipe } from '../pipes/course-query-transform.pipe';
import { CourseUpdateTransformPipe } from '../pipes/course-update-transform.pipe';

@ApiTags('Course')
@Controller('/admin/courses')
@Staff()
export class CourseAdminController {
  constructor(
    private security: SecurityContextService,
    @Inject(COURSE_SERVICE)
    private courseService: CourseService,
    @Inject(CHAPTER_SERVICE)
    private chapterService: ChapterService,
    @Inject(LESSON_SERVICE)
    private lessonService: LessonService,
    @Inject(FILE_STORAGE_SERVICE)
    private fileStorageService: FileStorageService,
  ) {}

  @Post()
  async create(@Body(CourseCreateTransformPipe) values: CourseCreateDto) {
    return await this.courseService.create(values);
  }

  @UseGuards(CourseOwnerGuard)
  @Put()
  async update(@Body(CourseUpdateTransformPipe) values: CourseUpdateDto) {
    await this.courseService.update(values);
  }

  @ApiOkResponsePaginated(CourseDto)
  @Get()
  async find(@Query(CourseQueryTransformPipe) query: CourseQueryDto) {
    return await this.courseService.find(query);
  }

  @UseGuards(CourseOwnerGuard)
  @Put(':id/publish')
  async publishCourse(@Param('id') id: string) {
    const user = this.security.getAuthenticatedUser();
    if (user.role === UserRole.CONTRIBUTOR) {
      throw new ForbiddenException('Contributors cannot publish courses');
    }
    await this.courseService.publish(user.id, id);
  }

  @UseGuards(CourseOwnerGuard)
  @Put(':id/unpublish')
  async unpublishCourse(@Param('id') id: string) {
    const user = this.security.getAuthenticatedUser();
    if (user.role === UserRole.CONTRIBUTOR) {
      throw new ForbiddenException('Contributors cannot unpublish courses');
    }
    await this.courseService.unpublish(id);
  }

  // @UseGuards(CourseOwnerGuard)
  // @Post(':id/image')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadImage(
  //   @Param('id') id: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const result = await this.fileStorageService.writeFile(file);

  //   if (!result) {
  //     throw new BadRequestException('Required upload file');
  //   }

  //   return result.url;
  // }

  @ApiBody({
    type: SortUpdateDto,
    isArray: true,
  })
  @UseGuards(CourseOwnerGuard)
  @Put(':id/sort-chapters')
  async sortChapter(@Body() values: SortUpdateDto[]) {
    await this.chapterService.updateSort(values);
  }

  @ApiBody({
    type: SortUpdateDto,
    isArray: true,
  })
  @UseGuards(CourseOwnerGuard)
  @Put(':id/sort-lessons')
  async sortLessons(@Body() values: SortUpdateDto[]) {
    await this.lessonService.updateSort(values);
  }

  @SerializeOptions({
    groups: ['detail'],
  })
  @UseGuards(CourseOwnerGuard)
  @Get(':id')
  async getCourse(
    @Param('id') id: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.courseService.findById(id);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }

  @UseGuards(CourseOwnerGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.courseService.delete(id);
  }
}
