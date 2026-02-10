export class TaskDto {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateTaskDto {
  title: string;
  description?: string;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}
