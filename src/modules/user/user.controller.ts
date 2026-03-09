import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';
import { UserService } from './user.service';

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
      throw new HttpException(`Usuario con id (${id}) no encontrado`, HttpStatus.NOT_FOUND);
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
    const user = await this.userSvc.updateUser(id, userData);
    if (!user) {
      throw new HttpException(`Usuario con id (${id}) no encontrado`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.userSvc.deleteUser(id);
    if (!user) {
      throw new HttpException(`Usuario con id (${id}) no encontrado`, HttpStatus.NOT_FOUND);
    }
    return { message: 'Usuario eliminado correctamente' };
  }
}
