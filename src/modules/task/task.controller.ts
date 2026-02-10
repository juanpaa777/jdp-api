import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TaskService } from './task/task.service';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(): string {
    return 'Obteniendo todas las tareas';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `Obteniendo tarea con ID: ${id}`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto): string {
    return `Creando tarea con título: ${createTaskDto.title} y descripción: ${createTaskDto.description || 'sin descripción'}`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): string {
    return `Actualizando tarea con ID: ${id} con datos: ${JSON.stringify(updateTaskDto)}`;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): string {
    return `Eliminando tarea con ID: ${id}`;
  }
}
