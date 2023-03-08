const mysql = require("mysql2");
const util = require("util");
const config = require("../config/configMySQL");


module.exports.executeSQL = async (sqlQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      var conn = mysql.createConnection(config.db);
      conn.connect(function (err) {
        if (err) throw err;
        conn.query(sqlQuery, function (err, result) {
          if (err) throw err;
          resolve(result);
        });
      });
    } catch (err) {
      reject(new Error(err));
    }
  });
};




