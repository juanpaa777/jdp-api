import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UtilService } from '../../common/services/util.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilService]
})
export class UserModule {}
