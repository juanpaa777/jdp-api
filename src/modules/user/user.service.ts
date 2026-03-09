import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';
import { UtilService } from '../../common/services/util.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private utilSvc: UtilService
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        lastName: true,
        createdAt: true
      }
    });
  }

  async getUserById(id: number): Promise<UserDto | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        lastName: true,
        createdAt: true
      }
    });
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.prisma.user.findFirst({
      where: { username: userData.username }
    });

    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const hashedPassword = await this.utilSvc.hashPassword(userData.password);

    return await this.prisma.user.create({
      data: {
        name: userData.name,
        lastName: userData.lastName,
        username: userData.username,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        username: true,
        lastName: true,
        createdAt: true
      }
    });
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<UserDto | null> {
    const updateData: any = {};
    
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.lastName !== undefined) updateData.lastName = userData.lastName;
    if (userData.username !== undefined) updateData.username = userData.username;
    if (userData.password !== undefined) {
      updateData.password = await this.utilSvc.hashPassword(userData.password);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        lastName: true,
        createdAt: true
      }
    });
  }

  async deleteUser(id: number): Promise<UserDto | null> {
    return await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        lastName: true,
        createdAt: true
      }
    });
  }
}
