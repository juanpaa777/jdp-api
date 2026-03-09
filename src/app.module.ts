import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { PrismaService } from './common/prisma/prisma.service';
import { ServicesService } from './common/services/services.service';

@Module({
  imports: [TaskModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ServicesService],
})
export class AppModule {}
