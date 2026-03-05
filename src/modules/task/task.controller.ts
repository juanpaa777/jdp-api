import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, HttpException, ParseIntPipe } from '@nestjs/common';

import { TaskService } from './task/task.service';

import { CreateTaskDto, TaskDto } from './dto/task.dto';

import { UpdateTaskDto } from './dto/update-task.dto';



@Controller('api/task')

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

      throw new HttpException(`Tarea con id (${id}) no encontrada`, HttpStatus.NOT_FOUND);

    }

    

    return result;

  }



  @Post()

  @HttpCode(HttpStatus.CREATED)

  public async insertTask(@Body() task: CreateTaskDto): Promise<TaskDto> {

    const result = await this.taskSvc.insertTask(task);

    if (result === undefined) {

      throw new HttpException(`Tarea no registrada`, HttpStatus.NOT_FOUND);

    }

    return result;

  }



  @Put(":id")

  public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto) {

    return await this.taskSvc.updateTask(id, task);

  }

  

  @Delete(":id")

  public async deleteTask(@Param("id", ParseIntPipe) id: number) {

    const result = await this.taskSvc.deleteTask(id);

    if (result === undefined) {

      throw new HttpException("No se pudo eliminar la tarea", HttpStatus.NOT_FOUND);

    }

    return result;

  }

}

