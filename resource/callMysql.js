const mysql = require("mysql2");
const util = require("util");
const config = require("../config/configMySQL");

module.exports.executeSQL = async (sqlQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      await mysql.createConnection(config.db);
const request = require("request");
      const query = util.promisify(mysql.query).bind(mysql);
      const result = await sql.query(sqlQuery);
      resolve(result.recordset);
    } catch (err) {
      reject(new Error(err));
    }
  });
};
