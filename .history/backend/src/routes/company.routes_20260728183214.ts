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
router.delete("/:id", deleteCompany);

export default router;