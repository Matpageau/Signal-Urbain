
export interface ErrorData extends Error {
  statusCode?: number
  errorKey?: string
}

export default function createError(message: string, statusCode: number, errorKey: string): ErrorData {
  const err = new Error(message) as ErrorData;
  err.statusCode = !isNaN(statusCode) ? statusCode : 500;
  err.errorKey = errorKey || "INTERNAL_SERVER_ERROR";
  return err;
}