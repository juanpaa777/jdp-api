import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";
import { ErrorCodes } from "./error-codes";

export class UserNotFoundException extends AppException {
  constructor(userId: number) {
    super(
      `Usuario con id ${userId} no encontrado`,
      HttpStatus.NOT_FOUND,
      ErrorCodes.USER.NOT_FOUND,
      { userId }
    );
  }
}

export class DuplicateUsernameException extends AppException {
  constructor(username: string) {
    super(
      `El nombre de usuario '${username}' ya está en uso`,
      HttpStatus.CONFLICT,
      ErrorCodes.USER.DUPLICATE_USERNAME,
      { username }
    );
  }
}

export class UserCreateFailedException extends AppException {
  constructor(details?: Record<string, any>) {
    super(
      'Error al crear el usuario',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.USER.CREATE_FAILED,
      details
    );
  }
}

export class UserUpdateFailedException extends AppException {
  constructor(userId: number, details?: Record<string, any>) {
    super(
      `Error al actualizar el usuario con id ${userId}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.USER.UPDATE_FAILED,
      { userId, ...details }
    );
  }
}

export class UserDeleteFailedException extends AppException {
  constructor(userId: number) {
    super(
      `Error al eliminar el usuario con id ${userId}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.USER.DELETE_FAILED,
      { userId }
    );
  }
}

export class UserInvalidDataException extends AppException {
  constructor(field: string, reason: string) {
    super(
      `Datos de usuario inválidos: ${field} - ${reason}`,
      HttpStatus.BAD_REQUEST,
      ErrorCodes.USER.INVALID_DATA,
      { field, reason }
    );
  }
}

export class UserHasTasksException extends AppException {
  constructor(userId: number) {
    super(
      `No se puede eliminar el usuario con id ${userId} porque tiene tareas asociadas`,
      HttpStatus.CONFLICT,
      ErrorCodes.USER.HAS_TASKS,
      { userId }
    );
  }
}
