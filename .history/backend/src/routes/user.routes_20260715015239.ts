import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Route Working",
  });
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
});

export default router;