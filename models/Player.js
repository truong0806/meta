const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Player = sequelize.define("Player", {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Player;
