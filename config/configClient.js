const dotenv = require("dotenv");
dotenv.config().parsed;

const configClient = {
  channelSecret: process.env.SECRET_TOKEN,
  channelAccessToken: process.env.ACCESS_TOKEN,
};

module.exports = configClient;
