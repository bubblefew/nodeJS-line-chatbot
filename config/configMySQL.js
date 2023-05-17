const dotenv = require("dotenv");
dotenv.config().parsed;
const config = {
  db: {
    // host: process.env.HOST,
    host: "119.59.114.233",
    port: "3333",
    user: "bubblefewza",
    password: "Few@64607007",
    // requestTimeout: 30000,
    database: "IS",
    charset: "utf8mb4",
  },
};

module.exports = config;
