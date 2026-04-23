import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task/task.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, Reflector]
})
export class TaskModule {}
