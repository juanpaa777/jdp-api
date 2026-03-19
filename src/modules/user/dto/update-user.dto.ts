import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class updateUserDto{
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(200)
    name: string; 

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(300)
    lastname: string; 

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    username: string;
    
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    password: string; 


}
