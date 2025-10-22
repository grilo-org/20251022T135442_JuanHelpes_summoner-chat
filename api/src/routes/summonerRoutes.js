const express = require("express");
const routes = express.Router();

const summonerController = require("../controllers/summonerController");

routes.post("/:gameName/:tagLine", summonerController.getPuuid);

module.exports = routes;
