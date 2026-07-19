import morgan from "morgan";
import fs from "fs";
import path from "path";

const dirPath = path.resolve();

export function logger(app, routerpath, router, logFileName) {
  const logstream = fs.createWriteStream(
    path.resolve(dirPath, "./src/Loggers", logFileName),
    { flags: "a" },
  );
  app.use(routerpath, morgan("combined", { stream: logstream }), router);
}
