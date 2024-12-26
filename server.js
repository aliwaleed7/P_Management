import sequelize from "./config/dbInit.js";
import app from "./app.js";
import { Server } from "socket.io";
import http from "http";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

    // Create an HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000", // Adjust for production
        methods: ["GET", "POST"],
      },
    });

    // Attach Socket.io to the app for global access
    app.set("io", io);

    // Handle WebSocket connections
    io.on("connection", (socket) => {
      console.log("New WebSocket connection:", socket.id);

      // Listen for room joining
      socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("WebSocket disconnected:", socket.id);
      });
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log("Error:", error);
  }
};

startServer();
