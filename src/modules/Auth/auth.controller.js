import Router from "express";
const router = Router();
export default router;
import * as authservice from "./auth.service.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import * as authvalidation from "./auth.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { loggingratelimitter } from "../../Middlewares/Ratelimitter.middleware.js";

router.post(
  "/signup",
  validation(authvalidation.signupSchema),
  authservice.signup,
);
router.post("/confirm-email", authservice.confirmEmail);
router.post("/resendConfirm-emailOTP", authservice.resendConfirmEmailOTP);
//-------------------------------------------------------------------------------

router.post("/resendForget-passOTP", authservice.resendForgetPasswordOTP);
router.post("/forget-passOTP", authservice.forgetPasswordOTP);
router.post("/reset-password", authservice.resetPassword);
router.post(
  "/UpdatePassword",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authservice.UpdatePass,
);
//-------------------------------------------------------------------------------
router.post("/login", loggingratelimitter, authservice.login);
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

router.post("/send-email", authservice.sendmails);
