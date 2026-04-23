import { Body, Controller, Delete, Get, ForbiddenException, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { user } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { updateUserDto } from "../dto/update-user.dto";
import { UtilService } from "../../../common/services/util.service";
import { AuthGuard } from "../../auth/interfaces/auth.guard";
import { RolesGuard } from "../../../common/guards/roles.guard";
import { Roles } from "../../../common/decorators/roles.decorator";
import { CurrentUser } from "../../../common/decorators/current-user.decorator";

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController{

    constructor(private userSvc: UserService, private readonly utilService: UtilService){}

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async listadoUsuarios():Promise<user[]>{
            return this.userSvc.listadoUsuarios();
        }


    @Get(":id")
    public async listUserById(
        @Param("id", ParseIntPipe) id:number,
        @CurrentUser() currentUser: any,
    ): Promise<user>{
        if (currentUser.sub !== Number(id) && currentUser.role !== 'ADMIN') {
            throw new ForbiddenException('No puedes ver el perfil de otro usuario');
        }
        const result= await this.userSvc.getUserById(id);
        if (result==undefined){
            throw new HttpException(`Usuario con id ${id} no encontrado`,HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    public async insertUser(@Body() user: CreateUserDto): Promise<user>{
        const encryptedPassword=await this.utilService.hashPassword(user.password);
        user.password=encryptedPassword;

        const result= await this.userSvc.insertUser(user);
        if (result==undefined)
            throw new HttpException(`Usuario No Registrado`,HttpStatus.INTERNAL_SERVER_ERROR)
        return result;
        

    }

    @Put(":id")
    public async updateUser(
        @Param("id", ParseIntPipe) id:number,
        @Body() user:updateUserDto,
        @CurrentUser() currentUser: any,
    ):Promise<user>{
        if (currentUser.sub !== Number(id) && currentUser.role !== 'ADMIN') {
            throw new ForbiddenException('No puedes modificar el perfil de otro usuario');
        }
        return await this.userSvc.updateUser(id,user);
    }

    @Delete(":id")
    public async deleteUser(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser() currentUser: any,
    ): Promise<Boolean>{
        if (currentUser.sub !== Number(id) && currentUser.role !== 'ADMIN') {
            throw new ForbiddenException('No puedes eliminar el perfil de otro usuario');
        }
        try{
            await this.userSvc.deleteUser(id);
        } catch(error: any){
            if (error.code === 'P2025') {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND);
            }
            throw error;
        }
        return true;
    }



}
