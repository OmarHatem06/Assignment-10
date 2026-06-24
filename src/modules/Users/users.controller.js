import Router from "express";
const router = Router();
export default router;
import * as userservice from "./users.service.js";
import {
  authentication,
  authorization,
} from "../../Middlewares/authentication.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";

router.get(
  "/getuser",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [RoleEnum.ADMIN] }),
  userservice.getuser,
);
