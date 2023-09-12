import { HttpErrorResponse } from '@common/types/http';
import { AppErrorType } from './types';
import { errorResponse } from '@common/utils/response';
import { AppErrorProps, assembleAppError } from './raise';

class AppError extends Error {
  readonly type: AppErrorType;
  readonly statusCode: number;

  private constructor(errorProps: AppErrorProps) {
    super(errorProps.message);
    this.type = errorProps.type;
    this.statusCode = errorProps.statusCode;
  }

  toResponseError(): HttpErrorResponse {
    const details = { error: this.type };
    return errorResponse(this.statusCode, this.message, details);
  }

  static raise(type: AppErrorType, message?: string): AppError {
    const errorProps = assembleAppError(type, message);
    return new AppError(errorProps);
  }
}

export default AppError;
