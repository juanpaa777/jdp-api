import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TaskNotFoundException } from '../../common/exceptions';
import { TaskService } from './task/task.service';
import { CreateTaskDto, TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/interfaces/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';



@Controller('api/task')
@UseGuards(AuthGuard)
export class TaskController {

  constructor(public readonly taskSvc: TaskService) { }



  @Get()

  getAllTasks(@CurrentUser() currentUser: any) {
    return this.taskSvc.getAllTasks(currentUser.sub, currentUser.role === 'ADMIN');
  }



  @Get(":id")

  public async listTaskById(@Param("id", ParseIntPipe) id: number, @CurrentUser() currentUser: any): Promise<TaskDto> {
    const result = await this.taskSvc.getTaskById(id, currentUser.sub, currentUser.role === 'ADMIN');
    if (result === undefined) {
      throw new TaskNotFoundException(Number(id));
    }
    return result;
  }



  @Post()

  @HttpCode(HttpStatus.CREATED)

  public async insertTask(@Body() task: CreateTaskDto, @CurrentUser() currentUser: any): Promise<TaskDto> {
    const result = await this.taskSvc.insertTask(task, currentUser.sub, currentUser.username);
    if (result === undefined) {
      throw new TaskNotFoundException(0);
    }
    return result;
  }



  @Put(":id")

  public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto, @CurrentUser() currentUser: any) {
    return await this.taskSvc.updateTask(id, task, currentUser.sub, currentUser.role === 'ADMIN', currentUser.username);
  }

  

  @Delete(":id")

  public async deleteTask(@Param("id", ParseIntPipe) id: number, @CurrentUser() currentUser: any) {
    await this.taskSvc.deleteTask(id, currentUser.sub, currentUser.role === 'ADMIN', currentUser.username);
  }
}
