const express = require("express");
const bodyParser = require("body-parser");
const line = require("@line/bot-sdk");
const cors = require("cors");

const config = require("./config/configClient");
const url = "https://c883-115-31-128-170.ap.ngrok.io";
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const client = new line.Client(config);

app.get("/index", (req, res) => {
  res.json("Server started ").status(200);
});


app.get("/pushMSG/:id", (req, res) => {
  // res.status(200).json("server started!");
  const { id } = req.params;
  let cusCode = "TH64607007";
  let cusName = "Jilasak Sampaisit";
  let reqNo = "UCR-2023012300001";
  const message = {
    type: "template",
    altText: "คำขอรายการปลดล็อคเครดิตลิมิต",
    template: {
      type: "buttons",
      thumbnailImageUrl:
        "https://plus.unsplash.com/premium_photo-1664202219850-0ed2a085aaa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80",
      imageAspectRatio: "rectangle",
      imageSize: "cover",
      imageBackgroundColor: "#FFFFFF",
      title: `Unlock Credit No: ${reqNo}`,
      text: `Customer Code:  ${cusCode} : ${cusName} `,
      defaultAction: {
        type: "uri",
        label: "View detail",
        uri: "http://example.com/page/123",
      },
      actions: [
        {
          type: "postback",
          label: "Approve",
          data: `Approve&${reqNo}`,
        },
        {
          type: "postback",
          label: "Reject",
          data: `Reject&${reqNo}`,
        },
        {
          type: "uri",
          label: "View detail",
          uri: `${url}/Reject`,
        },
      ],
    },
  };
  // const idLine = "U0d0e9e32d50828492ca9a9426c15f3d0";
  client
    .pushMessage(id, message)
    .then((res2) => {
      res.status(200).end();
      // res.json({ message: message, res: res2 });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).end();
    });
});

app.post("/webhook", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    handleMessageEvent(event);
  } else if (event.type === "postback") {
    try {
      let data = event.postback.data.split("&");
      if (data[0] === "Approve") {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "Approve Complete",
        });
      } else if (data[0] === "Reject") {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "Reject complete",
        });
      }
    } catch (error) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "Please contact ICT for resolve.",
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

app.listen(3000, () => {
  console.log("Server start on port : 3000");
});
