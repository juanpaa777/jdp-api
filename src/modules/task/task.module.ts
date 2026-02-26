import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task/task.service';
import { mysqlProvider } from '../../common/providers/mysql.provider';

@Module({
  controllers: [TaskController],
  providers: [TaskService, mysqlProvider]
})
export class TaskModule {}
