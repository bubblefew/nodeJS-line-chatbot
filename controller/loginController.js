const { executeSQL } = require("../resource/callMysql");
const { config } = require("../config/configMySQL");

module.exports.login = async (req, res, next) => {
  try {
    console.log("---Login---");
    // const data = req.body;
    // console.log(data);
    // const { id: user_id } = req.user;
    var qry = `select * 
    from salesman 
    where Sales_CompanyCode = '10'
    and Sales_Division = '101'
    and Sales_UserName = upper('JILASA_SAM')
    and Sales_PassWord = 'it12345'`;
    res.json("Bot Server Is Running : ");

  } catch (error) {
    console.log(error);
    next(error);
  }
};
