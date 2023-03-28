const { executeSQL } = require("../resource/callMysql");
const line = require("@line/bot-sdk");
const path = require("path");
const https = require("https");
const config = require("../config/configClient");
const client = new line.Client(config);
const request = require("request-promise");
const dialogflow = require("dialogflow");

const {
  messagesThankYou,
  messagesCantApprove,
} = require("../template/flexMessage");

var tmpReq = null;
module.exports.main = async (req, res, next) => {
  tmpReq = req;
  try {
    Promise.all(req.body.events.map(handleEvent))
      .then(async (result) => {
        res.json({ data: "ok", status: 200 });
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

  console.log(event);
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

async function handleMessageEvent(event) {
  const message = event.message.text;
  const userId = event.source.userId;
  try {
    await postToDialogflow();
  } catch (error) {
    console.log(error);
  }
}
const postToDialogflow = async () => {
  tmpReq.headers.host = "bots.dialogflow.com";
  return await request.post({
    uri: "https://bots.dialogflow.com/line/e9bef44f-9a74-4ddc-a4fb-3937232ea015/webhook",
    headers: tmpReq.headers,
    body: JSON.stringify(tmpReq.body),
  });
};
