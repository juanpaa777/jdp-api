import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { UserModule } from './modules/user/interface/user.module';
import { AuditModule } from './modules/audit/audit.module';
import { PrismaService } from './common/prisma/prisma.service';
import { UtilService } from './common/services/util.service';

@Module({
  imports: [TaskModule, AuthModule, UserModule, AuditModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UtilService],
})
export class AppModule {}
