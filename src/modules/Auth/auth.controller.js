import Router from "express";
const router = Router();
export default router;
import * as authservice from "./auth.service.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import * as authvalidation from "./auth.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";

router.post(
  "/signup",
  validation(authvalidation.signupSchema),
  authservice.signup,
);
router.post("/login", authservice.login);
router.post(
  "/refresh-token",
  authentication({ tokentype: tokenTypeEnum.REFRESH }),
  authservice.refreshToken,
);

router.post(
  "/social-login",

  authservice.loginwithgoogle,
);

router.post(
  "/logout",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),

  authservice.logout,
);
