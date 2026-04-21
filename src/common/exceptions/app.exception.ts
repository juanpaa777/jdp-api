import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./error-codes";

export interface ErrorResponse {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
}

export class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    public readonly errorCode: ErrorCode,
    public readonly details?: Record<string, any>
  ) {
    super(
      {
        message,
        errorCode,
        statusCode,
        details,
        timestamp: new Date().toISOString(),
      } as ErrorResponse,
      statusCode
    );
  }

  getErrorResponse(): ErrorResponse {
    return {
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.getStatus(),
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}

