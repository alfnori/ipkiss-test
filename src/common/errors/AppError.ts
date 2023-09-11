import { HttpErrorResponse } from '@common/types/http';
import { AppErrorType } from './types';
import { errorResponse } from '@common/utils/response';
import { AppErrorProps, assembleAppError } from './raise';

class AppError extends Error {
  private error: AppErrorType;
  private statusCode: number;

  private constructor(errorProps: AppErrorProps) {
    super(errorProps.message);
    this.error = errorProps.error;
    this.statusCode = errorProps.statusCode;
  }

  toResponseError(): HttpErrorResponse {
    const details = { error: this.error };
    return errorResponse(this.statusCode, this.message, details);
  }

  static raise(error: AppErrorType, message?: string): AppError {
    const errorProps = assembleAppError(error, message);
    return new AppError(errorProps);
  }
}

export default AppError;
