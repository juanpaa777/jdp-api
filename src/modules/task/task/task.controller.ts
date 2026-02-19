import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/task.dto';

@Controller('api/task')
export class TaskController {
  constructor(public readonly taskSvc: TaskService) {}

  @Get()
  getAllTasks() {
    return this.taskSvc.getAllTasks();
  }

  @Get(":id")
  public listTaskById(@Param("id") id: string) {
    return this.taskSvc.getTaskById(parseInt(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public insertTask(@Body() task: CreateTaskDto) {
    console.error("insert", task);
    return this.taskSvc.insertTask(task);
  }

  @Put(":id")
  public updateTask(@Param("id") id: string, @Body() task: any){
    return this.taskSvc.updateTask(parseInt(id), task);
  }
}
