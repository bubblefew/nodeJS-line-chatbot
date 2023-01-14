const express = require("express");
const bodyParser = require("body-parser");
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
const cors = require("cors");
var https = require("https");
var http = require("http");
dotenv.config().parsed;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const config = {
  channelSecret: process.env.SECRET_TOKEN,
  channelAccessToken: process.env.ACCESS_TOKEN,
};

const client = new line.Client(config);

app.get("/test", (req, res) => {
  const flexMsg = {
    type: "template",
    altText: "This is a buttons template",
    template: {
      type: "buttons",
      thumbnailImageUrl: "https://example.com/bot/images/image.jpg",
      imageAspectRatio: "rectangle",
      imageSize: "cover",
      imageBackgroundColor: "#FFFFFF",
      title: "Menu",
      text: "Please select",
      defaultAction: {
        type: "uri",
        label: "View detail",
        uri: "http://example.com/page/123",
      },
      actions: [
        {
          type: "postback",
          label: "Buy",
          data: "action=buy&itemid=123",
        },
        {
          type: "postback",
          label: "Add to cart",
          data: "action=add&itemid=123",
        },
        {
          type: "uri",
          label: "View detail",
          uri: "http://example.com/page/123",
        },
      ],
    },
  };
  let lineId = "U0d0e9e32d50828492ca9a9426c15f3d0";
  client
    .pushMessage(lineId, flexMsg)
    .then((res2) => {
      res .json(flexMsg);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/Approve", (req, res) => {
  let message = {
    type: "text",
    text: "Approve Complete",
  };

  const idLine = "U0d0e9e32d50828492ca9a9426c15f3d0";
  client
    .pushMessage(idLine, message)
    .then((res2) => {
      res.end();
      // res.json({ message: message, res: res2 });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/Reject", (req, res) => {
  let message = {
    type: "text",
    text: "Reject Complete",
  };
  const idLine = "U0d0e9e32d50828492ca9a9426c15f3d0";
  client
    .pushMessage(idLine, message)
    .then((res2) => {
      res.end();
      // res.json({ message: message, res: res2 });
    })
    .catch((err) => {
      console.error(err);
    });
});
app.get("/pushMSG/:id", (req, res) => {
  // res.status(200).json("server started!");
  const { id } = req.params;
  const message = {
    type: "template",
    altText: "This is a buttons template",
    template: {
      type: "buttons",
      thumbnailImageUrl:
        "https://plus.unsplash.com/premium_photo-1664202219850-0ed2a085aaa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80",
      imageAspectRatio: "rectangle",
      imageSize: "cover",
      imageBackgroundColor: "#FFFFFF",
      title: "Unlock Credit No: 256501140001",
      text: "Customer Code:  TH2100023 : จิระศักดิ์ เป็ดอร่อย",
      defaultAction: {
        type: "uri",
        label: "View detail",
        uri: "http://example.com/page/123",
      },
      actions: [
        {
          type: "postback",
          label: "Approve",
          data: "https://1c0d-161-246-72-2.ap.ngrok.io/Approve",
        },
        {
          type: "postback",
          label: "Reject",
          data: "https://1c0d-161-246-72-2.ap.ngrok.io/Reject",
        },
        {
          type: "uri",
          label: "View detail",
          uri: "https://1c0d-161-246-72-2.ap.ngrok.io/Reject",
        },
      ],
    },
  };
  // const idLine = "U0d0e9e32d50828492ca9a9426c15f3d0";
  client
    .pushMessage(id, message)
    .then((res2) => {
      res.end();
      // res.json({ message: message, res: res2 });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/webhook", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    handleMessageEvent(event);
  } else {
    return Promise.resolve(null);
  }
}

function handleMessageEvent(event) {
  const message = event.message;
  const text = message.text;
  const senderId = event.source.userId;
  console.log(senderId);
  // let countID = await checkId();
  let countID = 0;

  if (countID != 1) {
    console.log("insert member");
  }

  if (text === "Approve") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Approve Complete",
    });
  } else if (text === "Reject") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Reject Complete",
    });
  } else if (text === "hello") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Hello, world",
    });
  } else if (text === "push") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Hello, world",
    });
  } else if (text === "cast") {
    const message = {
      type: "text",
      text: "Boardcast to user",
    };

    client
      .broadcast(message)
      .then((res) => {
        console.log(res.body);
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (text === "flex") {
    const flexmessage = {
      type: "flex",
      altText: "This is a Flex Message",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "uri",
                label: "Button",
                uri: "https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message",
              },
            },
            {
              type: "separator",
            },
          ],
        },
      },
    };
    client.replyMessage(event.replyToken, flexmessage);
  } else {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "I do not understand what you are saying.",
    });
  }
}

app.listen(3000, () => {
  console.log("Server start on port : 3000");
});
