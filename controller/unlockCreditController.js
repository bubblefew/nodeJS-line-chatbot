const { exec } = require("child_process");
const { executeSQL } = require("../resource/callMysql");
const axios = require("axios");
const qs = require("qs");
module.exports.unlockCreditLimit = async (req, res, next) => {
  try {
    const jarPath = "D:/is/OIS2120_AUTO/dist/OIS2120_AUTO.jar";

    let { reqno, lineId } = req.body;
    // exec(`java -jar ${jarPath}`, async (error, stdout, stderr) => {
    // if (error) {
    //   console.error(`exec error: ${error}`);
    //   return;
    // }
    let sql = `UPDATE is.requestheader
      SET H_Status = '50' 
      WHERE H_RequestNumber='${reqno}' `;
    await executeSQL(sql);
    let params = qs.stringify({
      lineID: lineId,
      reqno: reqno,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/api/v1/chatbot/successfuly",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: params,
    };
    setTimeout(
      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        }),
      3000
    );
    res
      .send({ message: "Unlock Credit on M3 Successfuly!", Status: "OK" })
      .status(200)
      .end();
    // });
  } catch (error) {
    next(error);
  }
};
