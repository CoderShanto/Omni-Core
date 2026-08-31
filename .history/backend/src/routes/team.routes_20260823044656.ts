import { Router } from "express";

import {
  createTeam,
  getAllTeams,
} from "../controllers/team.controller";

import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", auth, createTeam);

router.get("/", auth, getAllTeams);

export default router;