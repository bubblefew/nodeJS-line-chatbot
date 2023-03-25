const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

/// routers///
var pushMessageRouter = require("./routes/pushMessage");
var webHookRouter = require("./routes/webhook");
var dataRouter = require("./routes/data");

//////////////

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/chatbot", pushMessageRouter);
app.use("/webhook", webHookRouter);
app.use("/api/v1/data", dataRouter);
app.post("/dialogflow", express.json(), async (req, res) => {
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
              // {
              //   payload: {
              //     line: {
              //       type: "image",
              //       originalContentUrl: `${result.ProdImg}`,
              //       previewImageUrl: `${result.ProdImg}`,
              //     },
              //   },
              // },
              {
                payload: {
                  line: {
                    type: "text",
                    text: `บาทค่ะ สนใจสั่งซื้อผ่านระบบ LINEMAN / ROBIN HOOD / SHOPPEE FOOD ได้เลยนะคะ`,
                  },
                },
              },
              {
                payload: {
                  line: {
                    type: "text",
                    text: `AAAAAAAAAAaa`,
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
});

app.listen(3000, () => {
  console.log("Server start on port : 3000");
});
