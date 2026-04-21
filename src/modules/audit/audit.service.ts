import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LogAction, LogSeverity } from '../../generated/prisma/client';

export interface CreateLogDto {
  action: LogAction;
  severity: LogSeverity;
  userId?: number;
  username?: string;
  details?: string;
}

export interface LogFilterDto {
  userId?: number;
  username?: string;
  action?: LogAction;
  severity?: LogSeverity;
  from?: Date;
  to?: Date;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: CreateLogDto): Promise<void> {
    await this.prisma.logs.create({
      data: {
        action: data.action,
        severity: data.severity,
        userId: data.userId ?? null,
        username: data.username ?? null,
        details: data.details ?? null,
      },
    });
  }

  async findAll(filters: LogFilterDto = {}) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.username) where.username = { contains: filters.username };
    if (filters.action) where.action = filters.action;
    if (filters.severity) where.severity = filters.severity;
    if (filters.from || filters.to) {
      where.timestamp = {};
      if (filters.from) where.timestamp.gte = new Date(filters.from);
      if (filters.to) where.timestamp.lte = new Date(filters.to);
    }

    return await this.prisma.logs.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        action: true,
        severity: true,
        timestamp: true,
        userId: true,
        username: true,
        details: true,
      },
    });
  }
}
