import Router from "express";
const router = Router();
export default router;
import * as authservice from "./auth.service.js";

router.post("/signup", authservice.signup);
router.post("/login", authservice.login);
