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

  async getTaskById(id: number): Promise<TaskDto | undefined> {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    const [result] = await this.mysql.query(query, [id]);
    return result[0] as TaskDto;
  }

  public async insertTask(task: CreateTaskDto): Promise<TaskDto> {
    const sql = `INSERT INTO tasks (name, description, priority, user_id) VALUES 
    ("${task.name}", "${task.description}", ${task.priority}, ${task.user_id})`;
    const [result] = await this.mysql.query(sql);
    const insertId = result.insertId;
    const insertedTask = await this.getTaskById(insertId);
    
    if (insertedTask === undefined) {
      throw new Error('Error al recuperar la tarea insertada');
    }
    
    return insertedTask;
  }
  public async updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<TaskDto | undefined> {
    const task = await this.getTaskById(id);

    if (!task) {
      return undefined;
    }

    task.name = taskUpdated.name ?? task.name;
    task.description = taskUpdated.description ?? task.description;
    task.priority = taskUpdated.priority ?? task.priority;

    const query = `
      UPDATE tasks
      SET name = '${task.name}',
          description = '${task.description}',
          priority = ${task.priority}
      WHERE id = ${id}
    `;

    await this.mysql.query(query);

    return await this.getTaskById(id);
  }

  public async deleteTask(id: number): Promise<boolean> {
    const query = `DELETE FROM tasks WHERE id = ${id}`;
    const [result] = await this.mysql.query(query);
    return result.affectedRows > 0;
  }
}
