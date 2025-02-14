import express from "express";
import spaceController from "../controller/spaceController.js";
import authMiddleware from "../controller/authController.js";

const router = express.Router();

// protected middleware
router.use(authMiddleware.protected);

// Define the route for creating a space
router.post("/createSpace", spaceController.createSpace);

// get spaces
router.get("/fetchSpace/:workspaceId", spaceController.fetchSpaces);

// remove space 
router.delete("/deleteSpace/:id", spaceController.removeSpace);

// Update the name of a space
router.put("/updateSpaces/:id", spaceController.updateSpaceName);

// Create a folder inside a space or another folder
router.post("/folders", spaceController.createFolder);

// Update the name of a folder
router.put("/folders/:id", spaceController.updateFolderName);

// Delete folder 
router.delete("/deletefolders/:id", spaceController.deleteFolder);

// Create a list inside a space or folder
router.post("/lists", spaceController.createList);

// update list 
router.put("/updateList/:id", spaceController.updateList);

// delete List 
router.delete("/deleteList/:id", spaceController.deleteList);

//  get getFoldersAndLists
router.get("/folders-lists/:spaceId", spaceController.getFoldersAndLists);


export default router;