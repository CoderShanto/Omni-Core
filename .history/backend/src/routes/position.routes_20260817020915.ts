import { Router } from "express";

import {
  createPosition,
  getAllPositions,
} from "../controllers/position.controller";

import { auth } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth,
  createPosition
);

router.get(
  "/",
  auth,
  getAllPositions
);

export default router;
