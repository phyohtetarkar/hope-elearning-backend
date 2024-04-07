import { Test, TestingModule } from '@nestjs/testing';
import { PostAdminController } from './post-admin.controller';

describe('PostAdminController', () => {
  let controller: PostAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostAdminController],
    }).compile();

    controller = module.get<PostAdminController>(PostAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
