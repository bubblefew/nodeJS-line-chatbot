const { exec } = require("child_process");
const { executeSQL } = require("../resource/callMysql");

module.exports.unlockCreditLimit = async (req, res, next) => {
  try {
    // const jarPath = "D:/is/OIS2120_AUTO/dist/OIS2120_AUTO.jar";
    const jarPath =
      "D:/java_project/JavaApplication2/dist/JavaApplication2.jar";
    let { reqno, lineId } = req.body;
    exec(`java -jar ${jarPath}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      let sql = `UPDATE is.requestheader
      SET H_Status = '50' 
      WHERE H_RequestNumber='${reqno}' `;

      await executeSQL(sql);

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res
        .send({ message: "Unlock Credit on M3 Successfuly!", Status: "OK" })
        .status(200)
        .end();
      let api = `http://localhost:3000/api/v1/chatbot/message`;
      // lineId
    });
  } catch (error) {
    next(error);
  }
};
