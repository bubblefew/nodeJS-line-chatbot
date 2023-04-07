const { executeSQL } = require("../resource/callMysql");
const line = require("@line/bot-sdk");
const https = require("https");
const config = require("../config/configClient");
const client = new line.Client(config);
const request = require("request-promise");
const dialogflow = require("dialogflow");
const { query } = require("express");

module.exports.dialogflow = async (req, res, next) => {
  let obj = "";
  try {
    let Intent = req.body.queryResult.intent.displayName;
    switch (Intent) {
      case "canceling":
        {
          const requestNumber =
            req.body.queryResult.parameters["requestnumber"];
          console.log(requestNumber);

          obj = {
            fulfillmentMessages: [
              {
                payload: {
                  line: {
                    type: "text",
                    text: `ระบบทำการยกเลิกหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`,
                  },
                },
              },
            ],
          };
        }
        break;
      default:
    }
  } catch (exception) {
    console.log(exception.message);
  }
  return res.status(200).send(obj);
};
