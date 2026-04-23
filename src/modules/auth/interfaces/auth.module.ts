import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { AuthGuard } from './auth.guard';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UtilService } from '../../../common/services/util.service';
import { AuditModule } from '../../audit/audit.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    AuditModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PrismaService, UtilService],
  exports: [AuthService],
})
export class AuthModule {}
