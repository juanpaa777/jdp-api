import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UtilService } from '../../common/services/util.service';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilService, Reflector],
  imports: [JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET, 
      signOptions: { expiresIn: '60s' },
    }),],
})

export class UserModule {}
