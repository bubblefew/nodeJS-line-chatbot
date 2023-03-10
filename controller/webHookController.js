const { executeSQL } = require("../resource/callMysql");
const line = require("@line/bot-sdk");
const config = require("../config/configClient");
const client = new line.Client(config);
const request = require("request-promise");

module.exports.main = async (req, res, next) => {
  try {
    Promise.all(req.body.events.map(handleEvent))
      .then((result) => {
        res.json(result).status(200).end();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  } catch (error) {
    next(error);
  }
};

async function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    handleMessageEvent(event);
  } else if (event.type === "postback") {
    try {
      let data = event.postback.data.split("&");

      if (data[0] === "Approve") {
        const sql = `UPDATE is.requestheader
        SET H_Status='20'
        WHERE H_RequestNumber='${data[1]}';`;
        let result = await executeSQL(sql);
        console.log(result.changedRows);
        if (result.changedRows > 0) {
          let messages = [
            { type: "text", text: "อนุมัติรายการคำขอปลดล็อคเครดิตสำเร็จ !" },
            {
              type: "text",
              text: "ขอบคุณ ก๊าบ ก๊าบ  $$",
              emojis: [
                {
                  index: 18,
                  productId: "5ac21184040ab15980c9b43a",
                  emojiId: "045",
                },
                {
                  index: 19,
                  productId: "5ac21184040ab15980c9b43a",
                  emojiId: "045",
                },
              ],
            },
            { type: "sticker", packageId: "789", stickerId: "10857" },
          ];
          return client.replyMessage(event.replyToken, messages);
        } else {
          let messages = [
            { type: "text", text: "ไม่สามารถทำการอัพเดทสถานะได้ก๊าบ" },
            { type: "text", text: "สาเหตุ ถูกอนุมัติเเล้ว ปลดล็อคแล้ว" },
            { type: "sticker", packageId: "6136", stickerId: "10551380" },
          ];
          return client.replyMessage(event.replyToken, messages);
        }
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

const postToDialogflow = (req) => {
  req.headers.host = "bots.dialogflow.com";
  return request.post({
    uri: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/63ff2386-14ac-4b83-b733-6426eb924ca4",
    headers: req.headers,
    body: JSON.stringify(req.body),
  });
};
