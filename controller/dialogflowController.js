const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const axios = require("axios");
const qs = require("qs");

module.exports.dialogflow = async (req, res, next) => {
  let obj = "";
  try {
    let Intent = req.body.queryResult.intent.displayName;
    console.log(Intent);
    switch (Intent) {
      case "Register":
        {
          let data = qs.stringify({
            lineID:
              req.body.originalDetectIntentRequest.payload.data.source.userId,
          });

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:3000/api/v1/chatbot/howtoregis",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
          };

          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        }
        break;
      case "HowTo":
        {
          obj = {
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    "วิธีการใช้งาน\n1.เข้าสู่ระบบบนเว็ปแอพพลิเคชัน\n2.กรอกแบบฟอร์มคำขอรายการปลดล็อค\n3.รอผู้อนุมัติ\n4.เมื่อรายการปลดล็อคสำเร็จ นายท่านจะได้รับข้อความแจ้งเตือน",
                  ],
                },
              },
            ],
          };
        }
        break;
      case "Pending":
        {
          let data = qs.stringify({
            lineID:
              req.body.originalDetectIntentRequest.payload.data.source.userId,
          });

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:3000/api/v1/chatbot/pendingitems",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
          };

          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        }
        break;
      case "Cancel":
        {
          let requestNumber = req.body.queryResult.parameters["requestnumber"];
          let msg = "";
          if ((i = 1)) {
            msg = `ระบบทำการยกเลิกหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`;
          } else {
            msg = `ระบบไม่สามารถทำการยกเลิกหมายเลขคำขอเลขที่ ${requestNumber} น้องไม่พบหมายเลขรายการ ก๊าบๆ`;
          }
          obj = {
            fulfillmentMessages: [
              {
                payload: {
                  line: {
                    type: "text",
                    text: msg,
                  },
                },
              },
            ],
          };
        }
        break;
      case "Tracking":
        {
          let lineID =
            req.body.originalDetectIntentRequest.payload.data.source.userId;
          let data = qs.stringify({
            lineID: lineID,
          });

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:3000/api/v1/chatbot/tracking",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
          };
          // console.log(config);

          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        }
        break;
      case "Approve":
        {
          let requestNumber = req.body.queryResult.parameters["requestnumber"];
          console.log(requestNumber);
          let i = 0;
          let msg = "";
          if ((i = 1)) {
            msg = `ระบบทำการอนุมัติหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`;
          } else {
            msg = `ระบบไม่สามารถทำการอนุมัติหมายเลขคำขอเลขที่ ${requestNumber} น้องไม่พบหมายเลขรายการ ก๊าบๆ`;
          }
          obj = {
            fulfillmentMessages: [
              {
                payload: {
                  line: {
                    type: "text",
                    text: msg,
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
};
