import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { LogAction, LogSeverity } from '../../../generated/prisma/client';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

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

  async insertTask(task: CreateTaskDto, userId: number, username?: string): Promise<TaskDto> {
    const result = await this.prisma.task.create({
      data: {
        name: task.name,
        description: task.description,
        priority: task.priority,
        user_id: userId,
      },
    });
    await this.auditService.log({
      action: LogAction.TASK_CREATED,
      severity: LogSeverity.INFO,
      userId,
      username,
      details: `Tarea creada: "${task.name}"`,
    });
    return result;
  }

  async updateTask(id: number, taskUpdated: UpdateTaskDto, userId: number, isAdmin: boolean, username?: string): Promise<TaskDto | undefined> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    if (!isAdmin && task.user_id !== userId) {
      throw new ForbiddenException('No puedes modificar una tarea que no es tuya');
    }
    const result = await this.prisma.task.update({ where: { id }, data: taskUpdated });
    await this.auditService.log({
      action: LogAction.TASK_UPDATED,
      severity: LogSeverity.INFO,
      userId,
      username,
      details: `Tarea actualizada: id ${id}`,
    });
    return result;
  }

  async deleteTask(id: number, userId: number, isAdmin: boolean, username?: string): Promise<TaskDto | null> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    if (!isAdmin && task.user_id !== userId) {
      throw new ForbiddenException('No puedes eliminar una tarea que no es tuya');
    }
    const result = await this.prisma.task.delete({ where: { id } });
    await this.auditService.log({
      action: LogAction.TASK_DELETED,
      severity: LogSeverity.WARNING,
      userId,
      username,
      details: `Tarea eliminada: "${task.name}" (id ${id})`,
    });
    return result;
  }
}
