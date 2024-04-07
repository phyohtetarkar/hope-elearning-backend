import { AuthenticationModule } from '@/authentication/authentication.module';
import { UserModule } from '@/user/user.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common';
import { BlogModule } from './blog/blog.module';
import * as cors from 'cors';
import { AuthenticationMiddleware } from './common/middlewares/authentication.middleware';

@Module({
  imports: [CommonModule, UserModule, AuthenticationModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: [],
          allowedHeaders: '*',
          credentials: true,
        }),
      )
      .forRoutes('*')
      .apply(AuthenticationMiddleware)
      .forRoutes('*');
    // .apply((req: Request, res: Response, next: NextFunction) => {
    //   const store: SecurityContext = {};
    //   this.als.run(store, () => next());
    // })
    // .forRoutes('*');
  }
}
