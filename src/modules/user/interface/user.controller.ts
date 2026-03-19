import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { user } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { updateUserDto } from "../dto/update-user.dto";
import { UtilService } from "../../../common/services/util.service";



@Controller('api/user')
export class UserController{

    constructor(private userSvc: UserService, private readonly utilService: UtilService){}

    @Get()
    async listadoUsuarios():Promise<user[]>{
            return this.userSvc.listadoUsuarios();
        }


    @Get(":id")
    public async listUserById(@Param("id", ParseIntPipe) id:number): Promise<user>{
        const result= await this.userSvc.getUserById(id);
        console.log("tipo de dato: ",typeof result)
        if (result==undefined){
            throw new HttpException(`Tarea con id ${id} no encontrada`,HttpStatus.NOT_FOUND);
            
        }
        return result;
    }

    @Post()
    public async insertUser(@Body() user: CreateUserDto): Promise<user>{
        const encryptedPassword=await this.utilService.hashPassword(user.password);
        user.password=encryptedPassword;

        const result= await this.userSvc.insertUser(user);
        if (result==undefined)
            throw new HttpException(`Usuario No Registrado`,HttpStatus.INTERNAL_SERVER_ERROR)
        return result;
        

    }

    @Put(":id")
    public async updateUser(@Param("id", ParseIntPipe) id:number,@Body() user:updateUserDto):Promise<user>{
        return await this.userSvc.updateUser(id,user);
    }

    @Delete(":id")
    public async deleteUser(@Param("id",ParseIntPipe) id:number): Promise<Boolean>{
        try{
            await this.userSvc.deleteUser(id);

        }catch(error){
            throw new HttpException("user not found",HttpStatus.NOT_FOUND);

        }
        return true;
    }



}
