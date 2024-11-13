const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("player_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
