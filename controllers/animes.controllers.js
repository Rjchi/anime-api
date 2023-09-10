const axios = require("axios");
const slug = require("slug");

const { load } = require("cheerio");
const { BASE_URL_2 } = require("../config.js");

/**-----------------------------------------------
 * |  Aqui obtenemos los animes por pagina
 -----------------------------------------------*/
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

/**-----------------------------------------------
 * |  Aqui obtenemos los enlaces de reproducción
 -----------------------------------------------*/
const seeAnime = async (req, res) => {
  try {
    const anime = slug(req.params.anime, "-");
    const episode = req.params.episode ? req.params.episode.trim() : "1";

    const { data } = await axios.get(
      `${BASE_URL_2}${
        anime === "go-toubun-no-hanayome" ? "go-toubun-no-hanayome∽" : anime
      }-episodio-${episode}-sub-espanol`
    );
    const $ = load(data);

    let links = [];
    $("div.mobius select option").each((i, el) => {
      const htmlString = Buffer.from($(el).attr("value"), "base64").toString(
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

/**-----------------------------------------------
 * |  Aqui obtenemos los detalles de un anime
 -----------------------------------------------*/
const animeDetails = async (req, res) => {
  try {
    const anime = slug(req.params.anime, "-");

    const { data } = await axios.get(`${BASE_URL_2}anime/${anime}`);

    const $ = load(data);
    let details = [];

    $("div.infox").each((i, el) => {
      const genres = [];
      const information = []
      $(el)
        .find("div.ninfo > div.info-content > div.genxed > a")
        .each((item, genre) => {
          genres.push($(genre).text());
        });

      $(el)
        .find('div.ninfo > div.info-content > div.spe > span')
        .each((items, info) => {
          information.push($(info).text());
        });

      details.push({
        name: $(el).find("h1").text(),
        genres: genres,
        information: information,
        description: $(el).find("div.ninfo > div.info-content > div.entry-content > p").first().text(),
      });
    });

    if (details.length !== 0) {
      return res.status(200).json(details);
    } else {
      return res.status(404).json({ message: `No hay detalles para ${anime}` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAnimes,
  seeAnime,
  animeDetails,
};
