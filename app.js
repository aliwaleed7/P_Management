import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./route/userRoutes.js";
import userProfile from "./route/profileRoutes.js";
import workSpace from "./route/workspaceRoutes.js";
import task from "./route/taskRoutes.js";
// import invite from "./route/inviteRoutes.js";
import notification from "./route/notificationRoute.js";
import space from "./route/spaceRoutes.js"
import timeLog from "./route/timeLogRoute.js"
import Team from "./route/teamRoute.js";
import Sprint from "./route/sprintRoute.js";
import dash from "./route/dashRoute.js";



dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", userProfile);
app.use("/api/workspace", workSpace);
app.use("/api/task", task);
// app.use("/api/invite", invite);
app.use("/api/notification", notification);
app.use("/api/space", space);
app.use("/api/timelogs", timeLog);
app.use("/api/teams", Team);
app.use("/api/sprint", Sprint);
app.use("/api/dash", dash);

export default app;
