// controllers/workspaceController.js
import Workspace from "../models/workspace.js";
import Spaces from "../models/Space.js";
import Folder from "../models/Folder.js";
import List from "../models/List.js";
import Team from "../models/Team.js";
import Task from "../models/Task.js";

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

  fetchSpaces: async (req, res) => {
    const { workspaceId } = req.params; // Get workspaceId from URL parameters

    try {
      // Validate input
      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          message: "workspaceId is required.",
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

      // Fetch all spaces in the workspace
      const spaces = await Spaces.findAll({
        where: {
          workspace_id: workspaceId, // Filter by workspaceId
        },
      });

      // Send success response with the list of spaces
      return res.status(200).json({
        success: true,
        message: "Spaces fetched successfully.",
        data: spaces,
      });
    } catch (error) {
      console.error("Error fetching spaces:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching spaces.",
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
  // Create a folder inside a space or another folder
  createFolder: async (req, res) => {
    const { space_id, parent_folder_id, name, created_by } = req.body;

    try {
      // Validate input
      if (!name || !created_by) {
        return res.status(400).json({
          success: false,
          message: "Name and created_by are required.",
        });
      }

      if (!space_id && !parent_folder_id) {
        return res.status(400).json({
          success: false,
          message: "Either space_id or parent_folder_id is required.",
        });
      }

      // Check if the space exists (if space_id is provided)
      if (space_id) {
        const space = await Spaces.findByPk(space_id);
        if (!space) {
          return res.status(404).json({
            success: false,
            message: "Space not found.",
          });
        }
      }

      // Check if the parent folder exists (if parent_folder_id is provided)
      if (parent_folder_id) {
        const parentFolder = await Folder.findByPk(parent_folder_id);
        if (!parentFolder) {
          return res.status(404).json({
            success: false,
            message: "Parent folder not found.",
          });
        }
      }

      // Create the folder
      const folder = await Folder.create({
        space_id: space_id || null, // Set to null if parent_folder_id is provided
        parent_folder_id: parent_folder_id || null, // Set to null if space_id is provided
        name,
        created_by,
      });

      // Send success response
      return res.status(201).json({
        success: true,
        message: "Folder created successfully.",
        data: folder,
      });
    } catch (error) {
      console.error("Error creating folder:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the folder.",
        error: error.message,
      });
    }
  },
  updateFolderName: async (req, res) => {
    const { id } = req.params; // Get the folder ID from the URL parameters
    const { name } = req.body; // Get the new name from the request body

    try {
      // Validate input
      if (!id || !name) {
        return res.status(400).json({
          success: false,
          message: "Folder ID and name are required.",
        });
      }

      // Check if the folder exists
      const folder = await Folder.findByPk(id);
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: "Folder not found.",
        });
      }

      // Update the folder's name
      folder.name = name;
      await folder.save();

      // Send success response
      return res.status(200).json({
        success: true,
        message: "Folder name updated successfully.",
        data: folder,
      });
    } catch (error) {
      console.error("Error updating folder name:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the folder name.",
        error: error.message,
      });
    }
  },

  deleteFolder: async (req, res) => {
    const { id } = req.params; // Get the folder ID from the URL parameters

    try {
      // Validate input
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Folder ID is required.",
        });
      }

      // Check if the folder exists
      const folder = await Folder.findByPk(id);
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: "Folder not found.",
        });
      }

      // Delete the folder
      await folder.destroy();

      // Send success response
      return res.status(200).json({
        success: true,
        message: "Folder deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting folder:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the folder.",
        error: error.message,
      });
    }
  },

  // Create a list inside a space or folder
  // Create a list inside a space or folder
  createList: async (req, res) => {
    const { space_id, folder_id, name, created_by, progress, assigned_teamId } =
      req.body;

    try {
      // Validate required fields
      if (!name || !created_by) {
        return res.status(400).json({
          success: false,
          message: "Name and created_by are required.",
        });
      }

      if (!space_id && !folder_id) {
        return res.status(400).json({
          success: false,
          message: "Either space_id or folder_id is required.",
        });
      }

      // Validate optional `progress` field
      if (progress !== undefined && (progress < 0 || progress > 100)) {
        return res.status(400).json({
          success: false,
          message: "Progress must be between 0 and 100.",
        });
      }

      // Check if the space exists (if space_id is provided)
      if (space_id) {
        const space = await Spaces.findByPk(space_id);
        if (!space) {
          return res.status(404).json({
            success: false,
            message: "Space not found.",
          });
        }
      }

      // Check if the folder exists (if folder_id is provided)
      if (folder_id) {
        const folder = await Folder.findByPk(folder_id);
        if (!folder) {
          return res.status(404).json({
            success: false,
            message: "Folder not found.",
          });
        }
      }

      // Check if the assigned team exists (if provided)
      if (assigned_teamId) {
        const team = await Team.findByPk(assigned_teamId);
        if (!team) {
          return res.status(404).json({
            success: false,
            message: "Assigned team not found.",
          });
        }
      }

      // Create the list
      const list = await List.create({
        space_id: space_id || null, // Set to null if not provided
        folder_id: folder_id || null, // Set to null if not provided
        name,
        created_by,
        team_id: assigned_teamId || null, // Nullable
        progress: progress !== undefined ? progress : null, // Nullable
      });

      // Send success response
      return res.status(201).json({
        success: true,
        message: "List created successfully.",
        data: list,
      });
    } catch (error) {
      console.error("Error creating list:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the list.",
        error: error.message,
      });
    }
  },

  updateList: async (req, res) => {
    const { id } = req.params; // Get the list ID from the URL parameters
    const { name } = req.body; // Get the updated name from the request body

    try {
      // Validate input
      if (!id || !name) {
        return res.status(400).json({
          success: false,
          message: "List ID and name are required.",
        });
      }

      // Check if the list exists
      const list = await List.findByPk(id);
      if (!list) {
        return res.status(404).json({
          success: false,
          message: "List not found.",
        });
      }

      // Update the list's name
      list.name = name;
      await list.save();

      // Send success response
      return res.status(200).json({
        success: true,
        message: "List updated successfully.",
        data: list,
      });
    } catch (error) {
      console.error("Error updating list:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the list.",
        error: error.message,
      });
    }
  },

  deleteList: async (req, res) => {
    const { id } = req.params; // Get the list ID from the URL parameters

    try {
      // Validate input
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "List ID is required.",
        });
      }

      // Check if the list exists
      const list = await List.findByPk(id);
      if (!list) {
        return res.status(404).json({
          success: false,
          message: "List not found.",
        });
      }

      // Delete the list
      await list.destroy();

      // Send success response
      return res.status(200).json({
        success: true,
        message: "List deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the list.",
        error: error.message,
      });
    }
  },
  getFoldersAndLists: async (req, res) => {
    try {
      const { spaceId } = req.params;

      // Fetch folders that belong to the space and have no parent folder
      const folders = await Folder.findAll({
        where: {
          space_id: spaceId,
          parent_folder_id: null,
        },
      });

      // Fetch lists that belong to the space and have no folder assigned
      const lists = await List.findAll({
        where: {
          space_id: spaceId,
          folder_id: null,
        },
      });

      res.json({ folders, lists });
    } catch (error) {
      console.error("Error fetching folders and lists:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getFolderContent: async (req, res) => {
    const { folderId } = req.params; // Get folderId from route parameters

    try {
      // Use Sequelize's findAll method to fetch lists with matching folder_id
      const folderContent = await List.findAll({
        where: { folder_id: folderId },
        // Optionally, add additional options like attributes, order, include, etc.
      });

      // Return a success response with the data
      return res.status(200).json({
        success: true,
        message: "Folder content fetched successfully.",
        data: folderContent,
      });
    } catch (error) {
      console.error("Error fetching folder content:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching folder content.",
        error: error.message,
      });
    }
  },

  fetchTasksByListId: async (req, res) => {
    try {
      const { listId } = req.params; // Get projectId from URL params

      if (!listId) {
        return res
          .status(400)
          .json({ error: "listId (projectId) is required" });
      }

      // Fetch tasks associated with the given listId
      const tasks = await Task.findAll({
        where: { listId: listId },
        order: [["dueDate", "ASC"]], // Optional: Order tasks by due date
      });

      return res.status(200).json({ success: true, tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getSpacesWithProjects: async (req, res) => {
    try {
      const { workspace_id } = req.query; // Get workspace_id from query parameters

      if (!workspace_id) {
        return res.status(400).json({ message: "workspace_id is required" });
      }

      // Fetch spaces where workspace_id matches and include the related lists (projects)
      const spaces = await Spaces.findAll({
        where: { workspace_id }, // Filter spaces by workspace_id
        include: [
          {
            model: List,
            attributes: ["id", "name"], // Project fields
          },
        ],
        attributes: ["id", "name"],
        order: [["created_at", "DESC"]], // Order spaces by creation date (latest first)
      });

      // Return response
      return res.status(200).json(spaces);
    } catch (error) {
      console.error("Error fetching spaces with projects:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default spaceController;
