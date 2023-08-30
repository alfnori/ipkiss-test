import { HttpErrorResponse, HttpSuccessResponse } from "common/types/http";

export const successResponse = (
  statusCode: number,
  data: unknown,
  message?: string,
): HttpSuccessResponse => {
  const success: HttpSuccessResponse = {
    statusCode,
    success: true,
    message,
    data,
  };
  return success;
};

export const errorResponse = (
  statusCode: number,
  message: string,
  details?: unknown,
): HttpErrorResponse => {
  const error: HttpErrorResponse = {
    statusCode,
    success: false,
    message,
    details,
  };
  return error;
};
