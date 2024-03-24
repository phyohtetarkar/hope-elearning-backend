import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthUserStore } from './common/als/auth-user.store';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
    }),
    CommonModule,
    UserModule,
    AuthenticationModule,
    BlogModule,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly als: AsyncLocalStorage<AuthUserStore>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const store: AuthUserStore = {};
        this.als.run(store, () => next());
      })
      .forRoutes('*');
  }
}
