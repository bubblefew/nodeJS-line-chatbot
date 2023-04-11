const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const axios = require("axios");
const qs = require("qs");

module.exports.dialogflow = async (req, res, next) => {
  let obj = "";
  try {
    let Intent = req.body.queryResult.intent.displayName;
    switch (Intent) {
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
          const lineID =
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
