import { Router } from "express";
import {
  createPosition,
  getAllPositions,
} from "../controllers/position.controller";
import { auth } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Only CEO and Manager can create positions
router.post(
  "/",
  auth,
  authorizeRoles("ceo", "manager"),
  createPosition
);

// Internal staff can view positions
router.get(
  "/",
  auth,
  authorizeRoles("ceo", "manager", "team_lead", "employee"),
  getAllPositions
);

export default router;