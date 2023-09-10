const axios = require("axios");
const slug = require("slug");

const { load } = require("cheerio");
const { BASE_URL_2 } = require("../config.js");

const getAnimes = async (req, res) => {
  try {
    const page = req.params.page ? req.params.page : "1";

    const { data } = await axios.get(
      `${BASE_URL_2}anime?page=${page}&status=&type=&order`
    );
    const $ = load(data);

    let animes = [];
    $("div.listupd article.bs").each((i, el) => {
      const name = $(el).find("div > a > div.tt > h2").text();
      const sanitizedName = name
        .replace(/\//g, "-")
        .replace(/×/g, "x")
        .replace(/\./g, "-");

      animes.push({
        name: sanitizedName,
        img: $(el).find("div > a > div.limit img").attr("src"),
        dubbing: $(el).find("div > a > div.limit > div.bt > span.sb").text(),
      });
    });

    if (animes.length > 0) {
      return res.status(200).json(animes);
    } else {
      return res.status(404).json({ message: `No se encontraror animes.` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const seeAnime = async (req, res) => {
  try {
    const anime = slug(req.params.anime, "-");
    const episode = req.params.episode ? req.params.episode.trim() : "1";

    const { data } = await axios.get(
      `${BASE_URL_2}${
        anime === "go-toubun-no-hanayome" ? "go-toubun-no-hanayome∽" : anime
      }-episodio-${episode}-sub-espanol`
    );
    const $2 = load(data);

    let links = [];
    $2("div.mobius select option").each((i, el) => {
      const htmlString = Buffer.from($2(el).attr("value"), "base64").toString(
        "utf-8"
      );
      const match = htmlString.match(/src="([^"]+)"/);
      const url = match ? match[1] : null;
      if (url) {
        links.push({ link: url });
      }
    });

    if (links.length > 0) {
      return res.status(200).json(links);
    } else {
      return res.status(404).json({ message: `No se encontraron enlaces.` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAnimes,
  seeAnime,
};
