import Dashboard from "../models/dashboard.js"


const dashController = {
  createDashboard: async (req, res) => {
    try {
      const { dash_name, list_id } = req.body;

      // Validate input
      if (!dash_name || !list_id) {
        return res
          .status(400)
          .json({ message: "dash_name and list_id are required" });
      }

      // Create a new dashboard
      const newDashboard = await Dashboard.create({ dash_name, list_id });

      res.status(201).json({
        message: "Dashboard created successfully",
        dashboard: newDashboard,
      });
    } catch (error) {
      console.error("Error creating dashboard:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};



export default dashController;