import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCodes } from './error-codes';

export class InvalidCredentialsException extends AppException {
  constructor() {
    super(
      'Credenciales inválidas',
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTH.INVALID_CREDENTIALS
    );
  }
}

export class TokenInvalidException extends AppException {
  constructor() {
    super(
      'Token inválido o expirado',
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTH.TOKEN_INVALID
    );
  }
}

export class RefreshTokenInvalidException extends AppException {
  constructor() {
    super(
      'Refresh token inválido',
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTH.REFRESH_TOKEN_INVALID
    );
  }
}

export class RefreshTokenExpiredException extends AppException {
  constructor() {
    super(
      'Refresh token expirado',
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTH.REFRESH_TOKEN_EXPIRED
    );
  }
}

export class UnauthorizedAccessException extends AppException {
  constructor(details?: Record<string, any>) {
    super(
      'No autorizado para acceder a este recurso',
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTH.UNAUTHORIZED,
      details
    );
  }
}
