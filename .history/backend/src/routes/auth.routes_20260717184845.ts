import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
    registerUser,
    loginUser,
 } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;