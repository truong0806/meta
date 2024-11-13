const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const playerRoutes = require("./routes/players");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/players", playerRoutes);

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  });
});
