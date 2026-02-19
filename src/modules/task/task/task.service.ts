import { Injectable } from '@nestjs/common';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];
  private nextId = 1;

  getAllTasks(): TaskDto[] {
    return this.tasks;
  }

  getTaskById(id: number): TaskDto | undefined {
    return this.tasks.find(task => task.id === id);
  }

  insertTask(task: CreateTaskDto): TaskDto {
    console.log('Insertando tarea:', task);
    
    const newTask: TaskDto = {
      id: this.nextId++,
      name: task.name,
      description: task.description,
      priority: task.priority,
      user_id: task.user_id
    };
    
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: number, task: UpdateTaskDto): TaskDto | undefined {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return undefined;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...task
    };
    
    return this.tasks[taskIndex];
  }
}
