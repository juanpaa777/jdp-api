import { Injectable } from '@nestjs/common';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  findAll(): TaskDto[] {
    return this.tasks;
  }

  findOne(id: string): TaskDto | undefined {
    return this.tasks.find(task => task.id === id);
  }

  create(createTaskDto: CreateTaskDto): TaskDto {
    const newTask: TaskDto = {
      id: Math.random().toString(36).substring(7),
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: string, updateTaskDto: UpdateTaskDto): TaskDto | undefined {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return undefined;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateTaskDto,
      updatedAt: new Date(),
    };
    return this.tasks[taskIndex];
  }

  remove(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    return true;
  }
}
