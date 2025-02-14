// controllers/userController.js
// import User from "../models/user.js";
import Profile from "../models/Profile.js";

const profileController = {
  // get profile 
  getProfile: async (req, res) => {
    const { workspaceId } = req.query; // Assuming workspaceId is sent as a query parameter

    try {
      // Find the user with profile in a specific workspace
      const userProfile = await User.findByPk(req.user.id, {
        attributes: ["username", "email"],
        include: {
          model: Profile,
          where: { workspaceId }, // Filter by workspaceId in Profile
          attributes: [
            "jobTitle",
            "description",
            "department",
            "role",
            "picture",
          ],
        },
      });

      // Check if user profile is found
      if (!userProfile) {
        return res.status(404).json({ message: "User or Profile not found" });
      }

      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }

  },

  updateProfile: async (req, res) => {
    const { workspaceId } = req.query;  
    const { jobTitle, description, department, role, picture } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required." });
    }

    try {
      // Find the profile based on user ID and workspace ID
      let profile = await Profile.findOne({
        where: { userId: req.user.id, workspaceId },
      });

      // Create or update the profile
      if (!profile) {
        profile = await Profile.create({
          jobTitle,
          description,
          department,
          role,
          picture,
          userId: req.user.id,
          workspaceId,
        });
      } else {
        await profile.update({
          jobTitle,
          description,
          department,
          role,
          picture,
        });
      }

      res.json({ message: "Profile updated successfully", profile });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }

  },
};

export default profileController;
