import { Router } from "express";

import {
  createPosition,
  getAllPositions,
} from "../controllers/position.controller";

const router = Router();

router.post("/", createPosition);

router.get("/", getAllPositions);

export default router;