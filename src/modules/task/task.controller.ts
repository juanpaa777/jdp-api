import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TaskNotFoundException } from '../../common/exceptions';

import { TaskService } from './task/task.service';

import { CreateTaskDto, TaskDto } from './dto/task.dto';

import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/interfaces/auth.guard';



@Controller('api/task')
@UseGuards(AuthGuard)
export class TaskController {

  constructor(public readonly taskSvc: TaskService) { }



  @Get()

  getAllTasks() {

    return this.taskSvc.getAllTasks();

  }



  @Get(":id")

  public async listTaskById(@Param("id") id: number): Promise<TaskDto> {

    const result = await this.taskSvc.getTaskById(id);

    if (result === undefined) {
      throw new TaskNotFoundException(Number(id));
    }

    

    return result;

  }



  @Post()

  @HttpCode(HttpStatus.CREATED)

  public async insertTask(@Body() task: CreateTaskDto): Promise<TaskDto> {

    const result = await this.taskSvc.insertTask(task);

    if (result === undefined) {
      throw new TaskNotFoundException(0);
    }

    return result;

  }



  @Put(":id")

  public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto) {

    return await this.taskSvc.updateTask(id, task);

  }

  

  @Delete(":id")

  public async deleteTask(@Param("id", ParseIntPipe) id: number) {

   try {
    await this.taskSvc.deleteTask(id);
   } catch (error) {
    throw new TaskNotFoundException(id);
   }

}
}
