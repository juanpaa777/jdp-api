import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllTasks(userId: number, isAdmin: boolean): Promise<TaskDto[]> {
    return await this.prisma.task.findMany({
      where: isAdmin ? undefined : { user_id: userId },
      orderBy: [{ name: 'asc' }],
    });
  }

  async getTaskById(id: number, userId: number, isAdmin: boolean): Promise<TaskDto | undefined> {
    const task = await this.prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!task) return undefined;
    if (!isAdmin && task.user_id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta tarea');
    }
    return task;
  }

  async insertTask(task: CreateTaskDto, userId: number): Promise<TaskDto> {
    return await this.prisma.task.create({
      data: {
        name: task.name,
        description: task.description,
        priority: task.priority,
        user_id: userId,
      },
    });
  }

  async updateTask(id: number, taskUpdated: UpdateTaskDto, userId: number, isAdmin: boolean): Promise<TaskDto | undefined> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    if (!isAdmin && task.user_id !== userId) {
      throw new ForbiddenException('No puedes modificar una tarea que no es tuya');
    }
    return await this.prisma.task.update({ where: { id }, data: taskUpdated });
  }

  async deleteTask(id: number, userId: number, isAdmin: boolean): Promise<TaskDto | null> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    if (!isAdmin && task.user_id !== userId) {
      throw new ForbiddenException('No puedes eliminar una tarea que no es tuya');
    }
    return await this.prisma.task.delete({ where: { id } });
  }
}
