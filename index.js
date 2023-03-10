const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

/// routers///
var pushMessageRouter = require("./routes/pushMessage");
var webHookRouter = require("./routes/webhook");
//////////////

const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/chatbot", pushMessageRouter);
app.use("/webhook", webHookRouter);


app.listen(3000, () => {
  console.log("Server start on port : 3000");
});
