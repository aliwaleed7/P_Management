import express from "express";
import spaceController from "../controller/spaceController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

// protected middleware
router.use(authMiddleware.protected);

// Define the route for creating a space
router.post("/createSpace", spaceController.createSpace);

// remove space 
router.delete("/deleteSpace/:id", spaceController.removeSpace);

// Update the name of a space
router.put("/updateSpaces/:id", spaceController.updateSpaceName);

export default router;
