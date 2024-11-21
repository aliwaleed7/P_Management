import sequelize from "./config/dbInit.js";
import app from "./app.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

    //await sequelize.sync();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log("Error:", error);
  }
};

startServer();
