import { Injectable } from '@nestjs/common';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllTasks(): Promise<TaskDto[]> {
    return await this.prisma.task.findMany({
      orderBy: [{ name: 'asc' }]
    });
  }

  async getTaskById(id: number): Promise<TaskDto | undefined> {
    const task = await this.prisma.task.findUnique({
      where: { id: Number(id) }
    });
    return task || undefined;
  }

  async insertTask(task: CreateTaskDto): Promise<TaskDto> {
    return await this.prisma.task.create({
      data: {
        name: task.name,
        description: task.description,
        priority: task.priority,
        user_id: task.user_id
      }
    });
  }

  async updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<TaskDto | undefined> {
    return await this.prisma.task.update({
      where: { id },
      data: taskUpdated
    });
  }

  async deleteTask(id: number): Promise<TaskDto | null> {
    return await this.prisma.task.delete({
      where: { id }
    });
  }
}
