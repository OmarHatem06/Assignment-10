export const ErrorResponse = ({
  status = 500,
  message = "Error",
  extra = undefined,
}) => {
  const error = new Error(
    typeof message === "string" ? message : message?.message,
  );

  error.status = status;
  error.extra = extra;

  throw error;
};

export const BadRequestException = (
  message = "BadRequestException",
  extra = undefined,
) => {
  return ErrorResponse({ status: 400, message, extra });
};

export const ConflictException = (
  message = "ConflictException",
  extra = undefined,
) => {
  return ErrorResponse({ status: 409, message, extra });
};

export const UnAuthorizedException = (
  message = "UnAuthorizedException",
  extra = undefined,
) => {
  return ErrorResponse({ status: 401, message, extra });
};

export const ForbiddenException = (
  message = "ForbiddenException",
  extra = undefined,
) => {
  return ErrorResponse({ status: 403, message, extra });
};

export const TooManyRequests = (
  message = "TooManyRequests",
  extra = undefined,
) => {
  return ErrorResponse({ status: 429, message, extra });
};

export const NotFoundHandlerException = (
  message = "NotFoundHandlerException",
  extra = undefined,
) => {
  return ErrorResponse({ status: 404, message, extra });
};

export const GlobalErrorHandler = (err, req, res, next) => {
  const status = err.status ?? 500;
  return res
    .status(Number(status))
    .json({ message: err.message, stack: err.stack, status });
};
