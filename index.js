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
                const data = await query(`SELECT CRC_PYNO FROM cr_control `);
                if (events) {
                    let custRes = await loadCustomer(req.body.events[0].source.userId);
                    // let { userId, displayName, pictureUrl } = JSON.parse(custRes);
                    console.log(data[0].CRC_PYNO)
                    client.replyMessage(events[0].replyToken, st);
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


const st = {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
        "imageAspectRatio": "rectangle",
        "imageSize": "cover",
        "imageBackgroundColor": "#FFFFFF",
        "title": "Menu",
        "text": "Please select",
        "defaultAction": {
            "type": "uri",
            "label": "View detail",
            "uri": "http://example.com/page/123"
        },
        "actions": [
            {
                "type": "postback",
                "label": "Buy",
                "data": "action=buy&itemid=123"
            },
            {
                "type": "postback",
                "label": "Add to cart",
                "data": "action=add&itemid=123"
            },
            {
                "type": "uri",
                "label": "View detail",
                "uri": "http://example.com/page/123"
            }
        ]
    }
}

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
app.listen(3333, () => {
    console.log("Listen on port 4000 !!");
});



