export type HttpResponse = {
  statusCode: number;
  success: boolean;
};

export type HttpSuccessResponse = HttpResponse & {
  message?: string;
  data?: unknown;
};

export type HttpErrorResponse = HttpResponse & {
  message: string;
  details?: unknown;
};
