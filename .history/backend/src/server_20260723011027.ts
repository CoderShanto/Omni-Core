import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User";
import userRoutes from "./routes/user.routes";

import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import companyRoutes from "./routes/company.routes";


dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use(
  "/api/companies",
  companyRoutes
);
// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json({
//     success: true,
//     message: "MERN Backend Running",
//   });
// });

// app.get("/", async (req, res) => {
//   const user = await User.create({
//     name: "Shanto",
//     email: "shanto2@gmail.com",
//   });

//   res.json(user);
// });

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();