const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const axios = require("axios");
const qs = require("qs");
module.exports.regiterMember = async (req, res, next) => {
  // /api/v1/data/regitermember
  try {
    const { username, password, staffcode, firstname, lastname, lineid } =
      req.body;
    let sql = `INSERT INTO is.salesman
  (Sales_CompanyCode, Sales_Division, Sales_StaffCode, Sales_UserName, Sales_PassWord, Sales_FullName, Sales_LastName, Sales_LineID, Sales_Status, Sales_Role)
  VALUES(10, '101', '${staffcode}', '${username}', '${password}', '${firstname}', '${lastname}', '${lineid}', '20', 'AP');`;
    let rsl = await executeSQL(sql);
    if (rsl) {
      let data = qs.stringify({
        lineID: "U0d0e9e32d50828492ca9a9426c15f3d0",
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/api/v1/chatbot/register",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    next(error);
  }
};
