const dotenv = require("dotenv");
dotenv.config().parsed;
const config = {
  db: {
    host: "localhost",
    // host: "119.59.114.233",
    port: "3333",
    user: "root",
    password: "root",
    // requestTimeout: 30000,
    database: "IS",
    charset: "utf8mb4",
  },
};

module.exports = config;
