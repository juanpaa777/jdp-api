import { Body, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { user } from "../entities/user.entity";
import { updateUserDto } from "../dto/update-user.dto";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { UserHasTasksException } from "../../../common/exceptions";

@Injectable()
export class UserService {

    constructor(private readonly prisma:PrismaService){    }

    public async listadoUsuarios(): Promise<user[]> {
        
        const users= await this.prisma.user.findMany({
            orderBy:[{name:"asc"}],
            select:{
                id:true,
                name:true,
                lastname:true,
                username:true,
                password:false,
                created_at:true
            }
        });
        
        return users;
    }

    public async getUserById(id: number): Promise<user |null> {
        const user= await this.prisma.user.findUnique({
            where:{id},
            select:{
                id:true,
                name:true,
                lastname:true,
                username:true,
                password:false,
                created_at:true
            }
        });
        return user;

    }

    public async insertUser(@Body() user: CreateUserDto): Promise<user>  {
        const newUser=await this.prisma.user.create({
            data:user,
            select:{
                id:true,
                name:true,
                lastname:true,
                username:true,
                password:false,
                created_at:true
            }
        });
        return newUser;
        
    }

    public async updateUser(id:number,userUpdate: updateUserDto): Promise<user  > {
        try {
            const user=await this.prisma.user.update({
                where:{id},
                data: userUpdate
            });
            return user;
        } catch (error) {
            throw new Error('Usuario no encontrado');
        }
    }

    public async deleteUser(id: number): Promise<user> {
        try {
            const user=await this.prisma.user.delete({
                where:{id}
            });
            return user;
        } catch (error: any) {
            // Prisma error P2003 = Foreign key constraint failed
            if (error.code === 'P2003') {
                throw new UserHasTasksException(id);
            }
            throw error;
        }
    }

}
