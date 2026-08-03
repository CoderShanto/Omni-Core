import { Router } from "express";
import {
  createTeam,
  getAllTeams,
} from "../controllers/team.controller";

const router = Router();

router.post("/", createTeam);
router.get("/", getAllTeams);

export default router;