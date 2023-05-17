const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config().parsed;
/// routers///
var pushMessageRouter = require("./routes/pushMessage");
var webHookRouter = require("./routes/webhook");
var dataRouter = require("./routes/data");
var UnlockCreditRouter = require("./routes/unlockCredit");
var DialogflowRouter = require("./routes/dialogflow");
const app = express();

const dayjs = require("dayjs");
dayjs("2023-05-16");
console.log(dayjs().format("dddd-MMM-YYYY"));

app.use(bodyParser.json());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/v1/chatbot", pushMessageRouter);
app.use("/webhook", webHookRouter);
app.use("/api/v1/data", dataRouter);
app.use("/api/v1/unlock", UnlockCreditRouter);
app.use("/dialogflow", DialogflowRouter);

app.listen(process.env.PORT, () => {
  console.log("Server start on port : 3000");
});
