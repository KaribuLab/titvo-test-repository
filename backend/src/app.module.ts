import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreviewModule } from './preview/preview.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: true,
    }),
    TodoModule,
    PreviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
