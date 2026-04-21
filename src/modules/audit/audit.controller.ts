import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService, LogFilterDto } from './audit.service';
import { AuthGuard } from '../auth/interfaces/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/audit')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getLogs(
    @Query('userId') userId?: string,
    @Query('username') username?: string,
    @Query('action') action?: string,
    @Query('severity') severity?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const filters: LogFilterDto = {
      userId: userId ? Number(userId) : undefined,
      username: username || undefined,
      action: action as any,
      severity: severity as any,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };
    return await this.auditService.findAll(filters);
  }
}
