import { rateLimit, MINUTE } from "express-rate-limit";

export const loggingratelimitter = rateLimit({
  windowMs: 10 * MINUTE,
  limit: 3,
  message: { message: "too many attempts try again later" },
  legacyHeaders: false,
});
