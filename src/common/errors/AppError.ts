import { HttpErrorResponse } from '@common/types/http';
import { AppErrorType } from './types';
import { errorResponse } from '@common/utils/response';

class AppError extends Error {
  private error: AppErrorType;
  private statusCode: number;
  private details: unknown;

  constructor(error: AppErrorType, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
    this.details = details;
  }

  toResponseError(): HttpErrorResponse {
    const details = { ...(this.details || {}), error: this.error };
    this.details = { ...details };
    return errorResponse(this.statusCode, this.message, details);
  }
}

export default AppError;
