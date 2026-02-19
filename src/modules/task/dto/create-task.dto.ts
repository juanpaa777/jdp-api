import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength, IsNumber } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(250)
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    priority: boolean;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;
}