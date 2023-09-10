const { config } = require("dotenv");

config();

const PORT = process.env.PORT;
const BASE_URL_2 = process.env.BASE_URL_2;

module.exports = {
  PORT,
  BASE_URL_2,
};
