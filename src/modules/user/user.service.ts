import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';
import { UtilService } from '../../common/services/util.service';
import {
  DuplicateUsernameException,
  UserNotFoundException,
  UserUpdateFailedException,
  UserDeleteFailedException,
  UserHasTasksException,
} from '../../common/exceptions';

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
        lastname: true,
        created_at: true
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
        lastname: true,
        created_at: true
      }
    });
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.prisma.user.findFirst({
      where: { username: userData.username }
    });

    if (existingUser) {
      throw new DuplicateUsernameException(userData.username);
    }

    const hashedPassword = await this.utilSvc.hashPassword(userData.password);

    return await this.prisma.user.create({
      data: {
        name: userData.name,
        lastname: userData.lastName,
        username: userData.username,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        username: true,
        lastname: true,
        created_at: true
      }
    });
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<UserDto | null> {
    const updateData: any = {};
    
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.lastName !== undefined) updateData.lastname = userData.lastName;
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
        lastname: true,
        created_at: true
      }
    });
  }

  async deleteUser(id: number): Promise<UserDto | null> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          lastname: true,
          created_at: true
        }
      });
    } catch (error: any) {
      // Prisma error code P2003 = Foreign key constraint failed
      if (error.code === 'P2003') {
        throw new UserHasTasksException(id);
      }
      throw error;
    }
  }
}
