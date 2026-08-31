import { Router } from "express";
import {
  createTeam,
  getAllTeams,
} from "../controllers/team.controller";
import { auth } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// CEO, Manager, and Team Lead can create teams
router.post(
  "/",
  auth,
  authorizeRoles("ceo", "manager", "team_lead"),
  createTeam
);

// Internal company members can view teams
router.get(
  "/",
  auth,
  authorizeRoles("ceo", "manager", "team_lead", "employee"),
  getAllTeams
);

export default router;