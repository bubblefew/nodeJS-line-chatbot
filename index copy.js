const express = require("express");
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
const app = express();
const axios = require("axios");
const mysql = require("mysql2");
const util = require("util");
const request = require("request");

dotenv.config().parsed;

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_TOKEN,
};

var conn = mysql.createConnection({
  host: "localhost",
  port: "3333",
  user: "root",
  password: "root",
  database: "is",
  charset: "utf8mb4",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const client = new line.Client(config);
const query = util.promisify(conn.query).bind(conn);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json("Bot Server Is Running");
});

app.post("/callback", line.middleware(config), async (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(async (result) => {
      const events = req.body.events;
      let sysId = 0;
      if (result == "pass") {
        const data = await query(`SELECT CRC_PYNO FROM cr_control `);
        if (events) {
          let custRes = await loadCustomer(req.body.events[0].source.userId);
          // let { userId, displayName, pictureUrl } = JSON.parse(custRes);
          console.log(data[0].CRC_PYNO);
          client.replyMessage(events[0].replyToken, st);
        } else {
          console.log("Failed");
        }
        // return events.lenght > 0 ? await events.map(item => handleEvent_msg(item)) : res.status(200).send('OK')
      } else {
        console.log("fail");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// const handleEvent = async (event) => {
//     // console.log(event);
//     if (event.type !== 'message' || event.message.type !== 'text') {
//         return null
//     } else if (event.type == 'message') {
//         return client.replyMessage(event.replyToken, { type: 'text', text: event.message.text })

//     }
// }

const st = {
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

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  return "pass";
}

const loadCustomer = async (userId) => {
  return await request.get({
    uri: `https://api.line.me/v2/bot/profile/${userId}`,
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });
};
app.listen(4000, () => {
  console.log("Listen on port 4000 !!");
});


const  flex = {
  "type": "bubble",
  "hero": {
    "type": "image",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": "http://linecorp.com/"
    },
    "url": "https://plus.unsplash.com/premium_photo-1664202219850-0ed2a085aaa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Unlock Credit No: 256501140001",
        "weight": "bold",
        "size": "xs"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Customer Code: ",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 4,
                "margin": "xs",
                "weight": "bold",
                "style": "normal",
                "decoration": "underline",
                "position": "relative",
                "align": "start",
                "gravity": "top",
                "wrap": true
              },
              {
                "type": "text",
                "text": "TH2100023 : จิระศักดิ์ เป็ดอร่อย",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Amount CO :",
                "color": "#aaaaaa",
                "size": "xs",
                "flex": 4,
                "weight": "bold",
                "style": "normal",
                "decoration": "underline",
                "position": "relative",
                "align": "start",
                "margin": "xs"
              },
              {
                "type": "text",
                "text": "500,000 Baht",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5
              }
            ]
          }
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "message",
          "label": "Approve",
          "text": "Approve"
        }
      },
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "message",
          "label": "Reject",
          "text": "Reject"
        }
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [],
        "margin": "sm"
      }
    ],
    "flex": 0
  }
}