const { executeSQL } = require("../resource/callMysql");
const { config } = require("../config/configMySQL");

module.exports.getData = async (req, res, next) => {
  try {
    console.log("---Query---");
    // const data = req.body;
    // console.log(data);
    // const { id: user_id } = req.user;
    var qry = `select * 
      from salesman 
      where Sales_CompanyCode = '10'
      and Sales_Division = '101'
      and Sales_UserName = upper('JILASA_SAM')
      and Sales_PassWord = 'it12345'`;
      res.json(qry)
    // let rsl = await executeSQL(qry);
    // return res.status(200).json({
    //   status_code: 200,
    //   message: "OK",
    //   data: rsl,
    // });
  } catch (error) {
    // console.log(error);
    // next(error);
  }
};
