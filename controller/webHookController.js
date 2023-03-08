const { executeSQL } = require("../resource/callMysql");
const line = require("@line/bot-sdk");
const config = require("../config/configClient");
const client = new line.Client(config);

module.exports.main = async (req, res, next) => {
  try {
    Promise.all(req.body.events.map(handleEvent))
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  } catch (error) {
    next(error);
  }
};

function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    handleMessageEvent(event);
  } else if (event.type === "postback") {
    try {
      let data = event.postback.data.split("&");
      const messages = [
        {
          type: "text",
          text: "Approve Complete",
        },
        {
          type: "sticker",
          packageId: "789",
          stickerId: "10884",
        },
      ];
      if (data[0] === "Approve") {
        console.log("Approved");
        return client.replyMessage(event.replyToken, messages);
      } else if (data[0] === "Reject") {
        console.log("Rejected");
        return client.replyMessage(event.replyToken, {
          type: "sticker",
          packageId: "789",
          stickerId: "10884",
        });
      }
    } catch (error) {
      return client.replyMessage(event.replyToken, {
        type: "sticker",
        packageId: "8522",
        stickerId: "16581283",
      });
    }
  } else {
    return Promise.resolve(null);
  }
}

function handleMessageEvent(event) {
  const message = event.message;
  const text = message.text;
  const senderId = event.source.userId;
  const type = event.type;
  console.log(senderId);
  if (text === "hello") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Hello, world",
    });
  } else {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "I do not understand what you are saying.",
    });
  }
}
