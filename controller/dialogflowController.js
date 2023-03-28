const { executeSQL } = require("../resource/callMysql");
const line = require("@line/bot-sdk");
const https = require("https");
const config = require("../config/configClient");
const client = new line.Client(config);
const request = require("request-promise");
const dialogflow = require("dialogflow");

module.exports.dialogflow = async (req, res, next) => {
  let obj = "";
  try {
    let Intent = req.body.queryResult.intent.displayName;
    console.log(req.body.queryResult.parameters);
    switch (Intent) {
      case "test":
        {
          console.log(req.body.queryResult.parameters.food);
          obj = {
            fulfillmentMessages: [
              {
                payload: {
                  line: {
                    type: "text",
                    text: `บาทค่ะ สนใจสั่งซื้อผ่านระบบ LINEMAN / ROBIN HOOD / SHOPPEE FOOD ได้เลยนะคะ`,
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
