const { Router } = require("express");
const {
  getAnimes,
  seeAnime,
  animeDetails,
} = require("../controllers/animes.controllers.js");

const router = Router();

router.get("/api/animes/:page", getAnimes);
router.get("/api/see/:anime/:episode", seeAnime);
router.get("/api/details/:anime", animeDetails);

module.exports = router;
