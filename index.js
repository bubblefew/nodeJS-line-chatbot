const express = require('express');
const line = require('@line/bot-sdk');
const dotenv = require("dotenv");
const app = express();
const axios = require("axios");
const mysql = require("mysql2");
const util = require('util');
const request = require("request")

dotenv.config().parsed;


const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_TOKEN
}

var conn = mysql.createConnection({
    host: "localhost",
    port: "3333",
    user: "root",
    password: "root",
    database: "is",
    charset: 'utf8mb4'
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const client = new line.Client(config);
const query = util.promisify(conn.query).bind(conn);


app.use(express.static('public'))

app.get("/", (req, res) => {
    res.json("Bot Server Is Running")
})



app.post('/callback', line.middleware(config), async (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then(async (result) => {
            const events = req.body.events
            let sysId = 0;
            if (result == "pass") {
                const data = await query(`SELECT * FROM cr_control `);
                if (events) {
                    let custRes = await loadCustomer(req.body.events[0].source.userId);
                    // let { userId, displayName, pictureUrl } = JSON.parse(custRes);
                    console.log(events)
                    client.replyMessage(events[0].replyToken, { type: 'text', text: "few" });
                } else {
                    console.log("Failed")
                }
                // return events.lenght > 0 ? await events.map(item => handleEvent_msg(item)) : res.status(200).send('OK')
            } else {
                console.log("fail");

            }
        }
        )
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

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    return "pass";
}


const loadCustomer = async (userId) => {
    return await request.get({
        uri: `https://api.line.me/v2/bot/profile/${userId}`,
        headers: {
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
        }
    });
}
app.listen(4000, () => {
    console.log("Listen on port 4000 !!");
});



