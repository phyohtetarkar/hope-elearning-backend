import { LessonRevisionEntity } from '@/core/entities/lesson-revision.entity';
import { CourseStatus, LessonDto } from '@/core/models';
import { LessonRevisionService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormLessonRevisionService implements LessonRevisionService {
  constructor(
    @InjectRepository(LessonRevisionEntity)
    private lessonRevisionRepo: Repository<LessonRevisionEntity>,
  ) {}

  async save(oldLesson: LessonDto, newLesson: LessonDto): Promise<void> {
    const currentTime = new Date().getTime() / 1000;
    const lastUpdatedAt = oldLesson.audit?.updatedAt
      ? new Date(oldLesson.audit.updatedAt).getTime() / 1000
      : 0;
    const timeSince = currentTime - lastUpdatedAt;

    let needToSave = false;
    let reason = 'background_save';
    if (oldLesson.chapter?.course?.status === CourseStatus.PUBLISHED) {
      reason = 'explicit_save';
      needToSave = true;
    } else if (oldLesson.audit?.updatedBy !== newLesson.audit?.updatedBy) {
      needToSave = true;
    } else if (timeSince > 1800) {
      needToSave = true;
    }

    if (!needToSave) {
      return;
    }

    await this.lessonRevisionRepo.insert({
      lessonId: oldLesson.id,
      authorId: oldLesson.audit?.updatedBy,
      createdAt: new Date(),
      title: oldLesson.title,
      lexical: oldLesson.lexical,
      reason: reason,
    });
  }
}
