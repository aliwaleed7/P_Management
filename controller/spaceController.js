// controllers/workspaceController.js
import Workspace from "../models/workspace.js";
import Spaces from "../models/Space.js";

const spaceController = {
  // Create a new space
  createSpace: async (req, res) => {
    const { workspaceId, name, createdBy } = req.body;

    try {
      // Validate input
      if (!workspaceId || !name || !createdBy) {
        return res.status(400).json({
          success: false,
          message: "workspaceId, name, and createdBy are required.",
        });
      }

      // Check if the workspace exists
      const workspace = await Workspace.findByPk(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      }

      // Check if a space with the same name already exists in the workspace
      const existingSpace = await Spaces.findOne({
        where: {
          name: name,
          workspace_id: workspaceId,
        },
      });

      if (existingSpace) {
        return res.status(409).json({
          success: false,
          message:
            "A space with the same name already exists in this workspace.",
        });
      }

      // Create the space
      const space = await Spaces.create({
        workspace_id: workspaceId, // Ensure this matches your DB schema
        name,
        created_by: createdBy, // Ensure this matches your DB schema
      });

      // Send success response
      return res.status(201).json({
        success: true,
        message: "Space created successfully.",
        data: space,
      });
    } catch (error) {
      console.error("Error creating space:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the space.",
        error: error.message,
      });
    }
  },

  // Remove a space by ID
  removeSpace: async (req, res) => {
    const { id } = req.params; // Get the space ID from the URL parameters

    try {
      // Validate input
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Space ID is required.",
        });
      }

      // Check if the space exists
      const space = await Spaces.findByPk(id);
      if (!space) {
        return res.status(404).json({
          success: false,
          message: "Space not found.",
        });
      }

      // Delete the space
      await space.destroy();

      // Send success response
      return res.status(200).json({
        success: true,
        message: "Space deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting space:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the space.",
        error: error.message,
      });
    }
  },
  // Update the name of a space
  updateSpaceName: async (req, res) => {
    const { id } = req.params; // Get the space ID from the URL parameters
    const { name } = req.body; // Get the new name from the request body

    try {
      // Validate input
      if (!id || !name) {
        return res.status(400).json({
          success: false,
          message: "Space ID and name are required.",
        });
      }

      // Check if the space exists
      const space = await Spaces.findByPk(id);
      if (!space) {
        return res.status(404).json({
          success: false,
          message: "Space not found.",
        });
      }

      // Check if a space with the same name already exists in the same workspace
      const existingSpace = await Spaces.findOne({
        where: {
          name: name,
          workspace_id: space.workspace_id, // Ensure the name is unique within the same workspace
        },
      });

      if (existingSpace && existingSpace.id !== parseInt(id)) {
        return res.status(409).json({
          success: false,
          message:
            "A space with the same name already exists in this workspace.",
        });
      }

      // Update the space's name
      space.name = name;
      await space.save();

      // Send success response
      return res.status(200).json({
        success: true,
        message: "Space name updated successfully.",
        data: space,
      });
    } catch (error) {
      console.error("Error updating space name:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the space name.",
        error: error.message,
      });
    }
  },
};

export default spaceController;
