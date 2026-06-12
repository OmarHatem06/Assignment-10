import express from "express";
import { bootstrap } from "./app.controller.js";

import { successResponse } from "./src/Utils/response/success.response.js";
import { PORT } from "./src/Configs/config.service.js";

const app = express();
const port = PORT;

app.get("/", (req, res) =>
  successResponse({
    res,
    statuscode: 200,
    message: "hello from the other world",
  }),
);
app.listen(port, () => console.log(`app listening on port ${port}!`));
bootstrap(app, express);
