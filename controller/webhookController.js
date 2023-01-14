const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
dotenv.config().parsed;

const config = {
  channelSecret: process.env.SECRET_TOKEN,
  channelAccessToken: process.env.ACCESS_TOKEN,
};
const client = new line.Client(config);

router.post("/webhook", (req, res) => {
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
    if (text === "hello") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "Hello, world",
      });
    } else if (text === "push") {
      const message = {
        type: "image",
        originalContentUrl:
          "https://images.unsplash.com/photo-1673280293847-97ad70e7512a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
        previewImageUrl:
          "https://images.unsplash.com/photo-1673276628202-737bf3020ac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
      };
      const idLine = "U0d0e9e32d50828492ca9a9426c15f3d0";
      client
        .pushMessage(idLine, message)
        .then((res) => {
          console.log(res.body);
        })
        .catch((err) => {
          console.error(err);
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