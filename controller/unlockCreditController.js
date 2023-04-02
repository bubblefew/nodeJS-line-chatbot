const { executeSQL } = require("../resource/callMysql");
const { exec } = require("child_process");

module.exports.unlockCreditLimit = async (req, res, next) => {
  try {
    const jarPath = "D:/is/OIS2120_AUTO/dist/OIS2120_AUTO.jar";

    exec(`java -jar ${jarPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res
        .send({ message: "Unlock Credit on M3 Successfuly!", Status: "OK" })
        .status(200)
        .end();
    });
  } catch (error) {
    next(error);
  }
};
