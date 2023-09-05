import AppError from './AppError';
import { AppErrorType } from './types';

export type AppErrorProps = {
  error: AppErrorType,
  message: string,
  statusCode: number
}

export const assembleAppError = (error: AppErrorType, customMessage?: string): AppErrorProps => {
  let statusCode = 500;
  let message;

  switch (error) {
    case AppErrorType.ALREADY_OPEN_ACCOUNT:
      statusCode = 409;
      message = 'The account provided was already open!';
      break;
    case AppErrorType.NOTFOUND_ORIGIN_ACCOUNT:
      statusCode = 404;
      message = 'The source account provided was not found!';
      break;
    case AppErrorType.NOTFOUND_DESTINY_ACCOUNT:
      statusCode = 404;
      message = 'The destiny account provided was not found!';
      break;
    case AppErrorType.NON_SUFFICIENT_FUNDS:
      statusCode = 422;
      message = 'The account funds are insufficient to perform this request!';
      break;
    case AppErrorType.INVALID_AMOUNT:
      statusCode = 400;
      message = 'The amount provided are invalid to perform this request!';
      break;
    default:
      break;
  }

  if (customMessage) {
    message += '\\n' + customMessage;
  }

  return {  error, message, statusCode };
};

const raiseAppError = (error: AppErrorType, message?: string): AppError => {
  return AppError.raise(error, message);
}

export default raiseAppError
