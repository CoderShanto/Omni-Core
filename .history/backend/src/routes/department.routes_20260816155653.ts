import { Router } from "express";

import {
  createDepartment,
  getAllDepartments,
} from "../controllers/department.controller";

import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", auth, createDepartment);

router.get("/", auth, getAllDepartments);

export default router;