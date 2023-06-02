const { exec } = require("child_process");
const { executeSQL } = require("../resource/callMysql");
const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv");
dotenv.config().parsed;

module.exports.unlockCreditLimit = async (req, res, next) => {
  try {
    const jarPath = "D:/is/OIS2120_AUTO/dist/OIS2120_AUTO.jar";

    let { reqno, lineId } = req.body;
    // exec(`java -jar ${jarPath} "${reqno}"`, async (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    //   }
    let sql = `UPDATE is.requestheader
      SET H_Status = '50' 
      WHERE H_RequestNumber='${reqno}' `;
    await executeSQL(sql);
    let rsl =
      await executeSQL(`select a.L_CompanyCode, a.L_DivisionCode, a.L_RequestNumber, a.L_CustomerOrder, a.L_CustomerOrderAmount 
                  ,b.H_CustomerCode 
                  from is.requestdetail a
                  left join is.requestheader b on a.L_CompanyCode = b.H_CompanyCode and a.L_RequestNumber = b.H_RequestNumber  
                  where a.L_CompanyCode = '10'
                  and a.L_DivisionCode = '101'
                  and a.L_RequestNumber = '${reqno}'`);

    for (let i = 0; i < rsl.length; i++) {
      let sqlLog = `INSERT INTO is.unlockcredit_log
                  (LOG_CompanyCode, LOG_DivisionCode, LOG_TransactionDate, LOG_CustomerCode, LOG_CustomerOrder, LOG_Status)
                  VALUES(10, '101', current_timestamp(), '${rsl[i].H_CustomerCode}', '${rsl[i].L_CustomerOrder}', '20');`;
      console.log(sqlLog);
      await executeSQL(sqlLog);
    }

    let params = qs.stringify({
      lineID: lineId,
      reqno: reqno,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/successfuly`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: params,
    };
    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      }),
      3000;

    res
      .send({ message: "Unlock Credit on M3 Successfuly!", Status: "OK" })
      .status(200)
      .end();

    // });
  } catch (error) {
    next(error);
  }
};
