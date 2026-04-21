import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/interfaces/auth.guard';
import { UserNotFoundException } from '../../common/exceptions';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userSvc: UserService
  ) {}
   

  @Get()
  async getAllUsers() {
    return await this.userSvc.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userSvc.getUserById(id);
    if (!user) {
      throw new UserNotFoundException(Number(id));
    }
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userData: CreateUserDto) {
    return await this.userSvc.createUser(userData);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDto) {
    return await this.userSvc.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.userSvc.deleteUser(id);
    return { message: 'Usuario eliminado correctamente' };
  }
}
