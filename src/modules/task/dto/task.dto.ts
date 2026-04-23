import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsNumber } from "class-validator";

export class TaskDto {
  id?: number;
  name: string;
  description: string;
  priority: boolean;
  user_id: number;
}

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

    @IsOptional()
    @IsNumber()
    user_id?: number;
}

export class UpdateTaskDto {
  name?: string;
  description?: string;
  priority?: boolean;
  user_id?: number;
}
