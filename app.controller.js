import {
  usersrouter,
  messagesrouter,
  authrouter,
} from "./src/modules/index.js";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { successResponse } from "./src/Utils/response/success.response.js";
import {
  GlobalErrorHandler,
  NotFoundHandlerException,
} from "./src/Utils/response/error.response.js";
import ConnectDB from "./src/DB/connection.js";
import cors from "cors";
import { sendEmail } from "./src/Utils/emails/email.utils.js";
import { redisConnection } from "./src/DB/redis.connection.js";
import { logger } from "./src/Utils/Loggers/morgan.js";
export const bootstrap = async (app, express) => {
  app.use(express.json(), cors(), helmet(), morgan("short"));

  app.use("/uploads", express.static(path.resolve("./src/uploads")));
  await ConnectDB();
  await redisConnection();
  logger(app, "/users", usersrouter, "access.log");
  logger(app, "/messages", messagesrouter, "access.log");
  logger(app, "/auth", authrouter, "access.log");

  app.use("/users", usersrouter);
  app.use("/messages", messagesrouter);
  app.use("/auth", authrouter);
  app.all("/*dummy", (req, res) => {
    NotFoundHandlerException();
  });

  app.use(GlobalErrorHandler);
};
