import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuditController],
  providers: [AuditService, PrismaService],
  exports: [AuditService],
})
export class AuditModule {}
