import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task/task.service';
import { PrismaService } from '../../common/prisma/prisma.service';



@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService]
})
export class TaskModule {}
