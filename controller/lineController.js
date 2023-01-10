const { executeSQL } = require("../resource/callMysql");
const { config } = require("../config/configMySQL");
const line = require("@line/bot-sdk");
const request = require("request");

module.exports.getUserID = async (req, res, next) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(async (result) => {
      if (result == "pass") {
        const events = req.body.events;
        lient.replyMessage(events[0].replyToken, "few");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  return "pass";
}
