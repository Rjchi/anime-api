const { Router } = require("express");
const { getAnimes, seeAnime } = require("../controllers/animes.controllers.js");

const router = Router();

router.get("/api/animes/:page", getAnimes)
router.get("/api/see/:anime/:episode", seeAnime)

module.exports = router;