import Router from "express";
const router = Router();
export default router;
import * as userservice from "./users.service.js";
import {
  authentication,
  authorization,
} from "../../Middlewares/authentication.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import {
  fileValidator,
  localFileUpload,
} from "../../Utils/multer/local.multer.js";

router.get(
  "/getuser",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [RoleEnum.ADMIN, RoleEnum.USER] }),
  userservice.getuser,
);
router.patch(
  "/updateProfile-pic",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [RoleEnum.USER] }),
  localFileUpload({
    customPath: "users",
    validation: [fileValidator.image],
  }).single("Attachments"),

  userservice.updateProfilepic,
);
router.patch(
  "/upload-coverimage",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [RoleEnum.USER] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidator.image],
  }).array("Attachments", 5),

  userservice.coverimages,
);
router.patch(
  "/freeze-account{/:userid}",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [RoleEnum.USER, RoleEnum.ADMIN] }),
  userservice.freeze,
);
router.patch(
  "/restore-account{/:userid}",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [RoleEnum.USER, RoleEnum.ADMIN] }),
  userservice.restore,
);

router.delete(
  "/delete-account/:userid",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [RoleEnum.ADMIN] }),
  userservice.deleteaccount,
);
