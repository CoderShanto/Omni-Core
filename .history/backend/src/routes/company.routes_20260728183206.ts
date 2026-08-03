import { Router } from "express";

import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller";

const router = Router();

router.post("/", createCompany);

router.get("/", getAllCompanies);
router.put("/:id", updateCompany);

export default router;