import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User";
import userRoutes from "./routes/user.routes";

import connectDB from "./config/db";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();