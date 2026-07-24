import Router from "express";
const router = Router();
export default router;
import * as messageservice from "./messages.service.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";

router.post("/sendmsg/:receiverid", messageservice.sendmessage);
router.get(
  "/get-msg",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  messageservice.getmsg,
);

router.get(
  "/toggle-read/:messageid",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  messageservice.toggleread,
);

router.get(
  "/toggle-fav/:messageid",
  authentication({ tokentype: tokenTypeEnum.ACCESS }),
  messageservice.togglefavourite,
);
