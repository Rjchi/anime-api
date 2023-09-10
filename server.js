const express = require("express");
const cors = require("cors");

const { PORT } = require("./config.js");
const animeRoutes = require("./routes/animes.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use(animeRoutes);

app.listen(PORT, () => console.log(`Server on Port: ${PORT}`));
