import { Inject, Injectable } from '@nestjs/common';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';


@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];
  private nextId = 1;
  
  constructor(@Inject('MYSQL_CONNECTION') private mysql: any) {
  }

  async getAllTasks(): Promise<TaskDto[]> {
    const query = 'SELECT * FROM tasks';
    const [rows] = await this.mysql.query(query);
    console.log('Tareas obtenidas:', rows);
    return rows;
    
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
