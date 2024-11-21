import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./route/userRoutes.js";
import userProfile from "./route/profileRoutes.js";
import workSpace from "./route/workspaceRoutes.js";
import task from "./route/taskRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", userProfile);
app.use("/api/workspace", workSpace);
app.use("/api/task", task);

export default app;
