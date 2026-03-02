import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateTaskDto {
   @IsOptional()
   @IsString({ message: "El nombre debe ser una cadena" })
   @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
    name?: string;


    @IsOptional()
    @IsString({ message: "La descripción debe ser una cadena" })
    @MinLength(3, { message: "La descripción debe tener al menos 3 caracteres" })
    description?: string;


    @IsOptional()
    @IsBoolean({ message: "La prioridad debe ser un booleano" })
    priority?: boolean;
}