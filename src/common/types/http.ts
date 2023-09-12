export type HttpResponseBase = {
  statusCode: number;
  success: boolean;
};

export type HttpSuccessResponse = HttpResponseBase & {
  message?: string;
  data?: unknown;
};

export type HttpErrorResponse = HttpResponseBase & {
  message: string;
  details?: unknown;
};

export type HttpResponse = HttpSuccessResponse | HttpErrorResponse;
