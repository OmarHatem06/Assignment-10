import { BadRequestException } from "../Utils/response/error.response.js";
import joi from "joi";
export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResults = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResults.error)
        validationError.push({ key, details: validationResults.error.details });
      if (validationError.length)
        throw BadRequestException("validation error", validationError);
      return next();
    }
  };
};
