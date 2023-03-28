const redis = require("redis");

const redisClient = redis.createClient();

(async () => {
  // Connect to redis server
  await redisClient.connect();
})();

app.get("/set", (req, res) => {
  try {
    redisClient.set("keyTest", "value from stored in redis");
  } catch (error) {
    console.log(error);
  }
  res.json("redis connected");
});
app.get("/test", async (req, res) => {
  const value = await redisClient.get("keyTest");
  if (value) {
    res.status(200).json(value).end();
  } else {
    res.status(400).json("NOK").end();
  }
});
