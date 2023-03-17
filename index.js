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
app.use('/api/v1/data', dataRouter)


app.listen(3000, () => {
  console.log("Server start on port : 3000");
});
