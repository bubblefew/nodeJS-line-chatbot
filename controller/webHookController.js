const { executeSQL } = require("../resource/callMysql");
const line = require("@line/bot-sdk");
const path = require("path");
const config = require("../config/configClient");
const client = new line.Client(config);
const request = require("request-promise");
var axios = require("axios");
const {
  messagesThankYou,
  messagesCantApprove,
} = require("../template/flexMessage");

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
  let user = await executeSQL(
    `select count(*) as count from is.salesman where Sales_LineID = '${event.source.userId}'`
  );
  // console.log(event);

  if (user[0].count === 0) {
    if (event.type === "postback" && event.postback.data === "NoRegis") {
      return client.replyMessage(event.replyToken, [
        {
          type: "text",
          text: "หากไม่ได้เป็นสมาชิกจะไม่สามารถทำการร้องขอปลดล็อคเครดิต\nหรือรับการแจ้งเตือนจากน้องเป็ดได้นะ ก๊าบๆๆๆๆ",
        },
        {
          type: "sticker",
          packageId: "11537",
          stickerId: "52002771",
        },
      ]);
    }
    return client.replyMessage(event.replyToken, {
      type: "template",
      altText: "this is a confirm template",
      template: {
        type: "confirm",
        actions: [
          {
            type: "uri",
            label: "Yes",
            // uri: `http://119.59.114.233:8080/CR_Control/register.jsp?lineID=${event.source.userId}`,
            uri: `http://localhost:8080/CR_Control/register.jsp?lineID=${event.source.userId}`,
          },
          {
            type: "postback",
            label: "No",
            data: "NoRegis",
          },
        ],
        text: "คุณยังไม่ได้สมัครสมาชิก คุณต้องการสมัครสมาชิกใช่หรือไม่ ? ",
      },
    });
  }
  if (event.type === "message" && event.message.type === "text") {
    handleMessageEvent(event);
  } else if (event.type === "postback") {
    try {
      let data = event.postback.data.split("&");
      if (data[0] === "Approve") {
        const sql = `UPDATE is.requestheader
        SET H_Status=${data[2]}
        WHERE H_RequestNumber='${data[1]}';`;
        console.log(sql);
        let result = await executeSQL(sql);
        if (result.changedRows > 0) {
          data[2] === "30" ? true : false;
          return client.replyMessage(event.replyToken, messagesThankYou);
        } else {
          return client.replyMessage(event.replyToken, messagesCantApprove);
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
