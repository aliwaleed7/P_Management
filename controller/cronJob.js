import cron from "node-cron";
import taskController from "./taskController";

// Schedule to run every 24 hours (at midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Running cron job: Checking upcoming task deadlines...");
  await taskController.checkUpcomingDeadlines();
});
