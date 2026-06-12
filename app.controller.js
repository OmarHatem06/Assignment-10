import {
  usersrouter,
  messagesrouter,
  authrouter,
} from "./src/modules/index.js";

import { successResponse } from "./src/Utils/response/success.response.js";
import {
  GlobalErrorHandler,
  NotFoundHandlerException,
} from "./src/Utils/response/error.response.js";
import ConnectDB from "./src/DB/connection.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());
  app.use("/users", usersrouter);
  await ConnectDB();
  app.use("/messages", messagesrouter);
  app.use("/auth", authrouter);
  app.all("/*dummy", (req, res) => {
    NotFoundHandlerException();
  });

  app.use(GlobalErrorHandler);
};
