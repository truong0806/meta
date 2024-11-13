const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

router.get("/", async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving players" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, age, level, address } = req.body;
    const newPlayer = await Player.create({ name, age, level, address });
    res.json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: "Error creating player" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, level, address } = req.body;

    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    await player.update({ name, age, level, address });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Error updating player" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    await player.destroy();
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting player" });
  }
});

module.exports = router;
