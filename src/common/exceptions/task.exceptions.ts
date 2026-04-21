import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCodes } from './error-codes';

export class TaskNotFoundException extends AppException {
  constructor(taskId: number) {
    super(
      `Tarea con id ${taskId} no encontrada`,
      HttpStatus.NOT_FOUND,
      ErrorCodes.TASK.NOT_FOUND,
      { taskId }
    );
  }
}

export class TaskCreateFailedException extends AppException {
  constructor(details?: Record<string, any>) {
    super(
      'Error al crear la tarea',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.TASK.CREATE_FAILED,
      details
    );
  }
}

export class TaskUpdateFailedException extends AppException {
  constructor(taskId: number) {
    super(
      `Error al actualizar la tarea con id ${taskId}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.TASK.UPDATE_FAILED,
      { taskId }
    );
  }
}

export class TaskDeleteFailedException extends AppException {
  constructor(taskId: number) {
    super(
      `Error al eliminar la tarea con id ${taskId}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.TASK.DELETE_FAILED,
      { taskId }
    );
  }
}
