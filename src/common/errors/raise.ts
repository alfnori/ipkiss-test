import AppError from './AppError';
import { AppErrorType } from './types';

export const raiseAppError = (error: AppErrorType, message?: string): AppError => {
  let statusCode = 500;
  let messageError;

  switch (error) {
    case AppErrorType.ALREADY_OPEN_ACCOUNT:
      statusCode = 409;
      messageError = 'The account provided was already open!';
      break;
    case AppErrorType.NOTFOUND_ORIGIN_ACCOUNT:
      statusCode = 404;
      messageError = 'The source account provided was not found!';
      break;
    case AppErrorType.NOTFOUND_DESTINY_ACCOUNT:
      statusCode = 404;
      messageError = 'The destiny account provided was not found!';
      break;
    case AppErrorType.NON_SUFFICIENT_FUNDS:
      statusCode = 422;
      messageError = 'The account funds are insufficient to perform this request!';
      break;
    case AppErrorType.INVALID_AMOUNT:
      statusCode = 400;
      messageError = 'The amount provided are invalid to perform this request!';
      break;
    default:
      break;
  }

  if (message) {
    messageError += '\\n' + message;
  }

  return new AppError(error, messageError, statusCode);
};
