import { Test, TestingModule } from '@nestjs/testing';
import { TagAdminController } from './tag-admin.controller';

describe('TagAdminController', () => {
  let controller: TagAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagAdminController],
    }).compile();

    controller = module.get<TagAdminController>(TagAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
