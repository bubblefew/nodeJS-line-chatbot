const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv");
dotenv.config().parsed;
module.exports.dialogflow = async (req, res, next) => {
  let obj = "";
  try {
    let Intent = req.body.queryResult.intent.displayName;
    console.log(Intent);
    switch (Intent) {
      case "RequestUnlockCredit":
        {
          obj = {
            fulfillmentMessages: [
              {
                payload: {
                  line: {
                    type: "template",
                    altText: "ลิงค์สำหรับทำรายการคำขอปลดล็อคเครดิต",
                    template: {
                      type: "buttons",
                      thumbnailImageUrl:
                        "https://cdn.pixabay.com/photo/2016/03/21/23/25/link-1271843_960_720.png",
                      title: "Link",
                      text: "สามารถกดเพื่อไปยังเว็บไซต์สำหรับการทำรายการปลดเครดิต",
                      actions: [
                        {
                          type: "uri",
                          label: "Click & Go !",
                          uri: "http://119.59.114.233:8080/CR_Control/login.jsp",
                        },
                      ],
                    },
                  },
                },
              },
            ],
          };
        }
        break;
      case "Hello":
        {
          obj = {
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    "สวัสดีครับ นายท่าน มีอะไรให้น้องเป็ดช่วยเหลือไหม ก้าบ ก้าบ",
                  ],
                },
              },
              {
                text: {
                  text: ["หากต้องการใช้งานน้องบอท สามารถเรียกได้เลยน้า"],
                },
              },
            ],
          };
        }
        break;
      case "Register":
        {
          let data = qs.stringify({
            lineID:
              req.body.originalDetectIntentRequest.payload.data.source.userId,
          });

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/howtoregis`,
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
            url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/pendingitems`,
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
          let sql = `select * from is.requestheader where H_RequestNumber = '${requestNumber}' and cast(H_Status as DECIMAL) <> 50 `;
          let rsl = await executeSQL(sql);
          let msg = "";
          if (rsl.length === 1) {
            const sql = `UPDATE is.requestheader
            SET H_Status= '99'
            where H_CompanyCode = '10'
            and H_DivisionCode = '101'
            and H_RequestNumber  = '${requestNumber}'  
            and cast(H_Status as DECIMAL) <> 50 `;
            await executeSQL(sql);
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
      case "CancelNow":
        {
          let requestNumber = req.body.queryResult.parameters["requestnumber"];
          let sql = `select * from is.requestheader where H_RequestNumber = '${requestNumber}' and cast(H_Status as DECIMAL) <> 50 `;
          let rsl = await executeSQL(sql);
          let msg = "";
          let stickerObj = {
            type: "sticker",
            packageId: "789",
            stickerId: "10879",
          };
          if (rsl.length === 1) {
            const sql = `UPDATE is.requestheader
            SET H_Status= '99'
            where H_CompanyCode = '10'
            and H_DivisionCode = '101'
            and H_RequestNumber  = '${requestNumber}'  
            and cast(H_Status as DECIMAL) <> 50 `;
            await executeSQL(sql);
            msg = `ระบบทำการยกเลิกหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`;
          } else {
            msg = `ระบบไม่สามารถทำการยกเลิกหมายเลขคำขอเลขที่ ${requestNumber} น้องไม่พบหมายเลขรายการ ก๊าบๆ`;
            stickerObj.packageId = "789";
            stickerObj.stickerId = "10870";
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
              {
                payload: {
                  line: {
                    type: "sticker",
                    packageId: stickerObj.packageId,
                    stickerId: stickerObj.stickerId,
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
            url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/tracking`,
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
          let sql = `select a.*,b.Sales_LineID 
          from is.requestheader a
          left join is.salesman b on b.Sales_UserName = a.H_UserRequest and a.H_CompanyCode = b.Sales_CompanyCode 
          where a.H_RequestNumber = '${requestNumber}' and a.H_Status IN ('20','30')`;
          let rsl = await executeSQL(sql);
          let stickerObj = {
            type: "sticker",
            packageId: "789",
            stickerId: "10863",
          };
          let msg = "";
          if (rsl.length > 0) {
            let sqlUpdateStatus = `UPDATE is.requestheader
            SET H_Status= '${rsl[0].H_Status}' + 10
            WHERE H_RequestNumber='${requestNumber}' `;
            await executeSQL(sqlUpdateStatus);
            msg = `ระบบทำการอนุมัติหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`;
            if (rsl[0].H_Status === "20") {
              let queryString = qs.stringify({
                cono: "10",
                divi: "101",
                reqno: requestNumber,
              });
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/message`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: queryString,
              };
              axios
                .request(config)
                .then((response) => {
                  console.log("FFFFFFFFFFFFFFFFFFF");
                })
                .catch((error) => {
                  console.log(error);
                });
            } else if (rsl[0].H_Status === "30") {
              let queryString = qs.stringify({
                cono: "10",
                divi: "101",
                reqno: requestNumber,
                lineId: rsl[0].H_UserRequest,
              });
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `http://${process.env.HOST_API}:3000/api/v1/unlock/unlockcreditlimit`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: queryString,
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
          } else {
            msg = `ระบบไม่สามารถทำการอนุมัติหมายเลขคำขอเลขที่ ${requestNumber} น้องไม่พบหมายเลขรายการ ก๊าบๆ`;
            stickerObj.packageId = "789";
            stickerObj.stickerId = "10870";
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
              {
                payload: {
                  line: {
                    type: "sticker",
                    packageId: stickerObj.packageId,
                    stickerId: stickerObj.stickerId,
                  },
                },
              },
            ],
          };
        }
        break;
      case "ApproveNow":
        {
          let requestNumber = req.body.queryResult.parameters["requestnumber"];
          console.log(requestNumber);
          let sql = `select * from is.requestheader where H_RequestNumber = '${requestNumber}' and H_Status IN ('20','30')`;
          let rsl = await executeSQL(sql);
          let msg = "";
          let stickerObj = {
            type: "sticker",
            packageId: "789",
            stickerId: "10863",
          };

          if (rsl.length > 0) {
            let sqlUpdateStatus = `UPDATE is.requestheader
            SET H_Status= '${rsl[0].H_Status}' + 10
            WHERE H_RequestNumber='${requestNumber}' `;
            await executeSQL(sqlUpdateStatus);
            msg = `ระบบทำการอนุมัติหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`;
            if (rsl[0].H_Status === "20") {
              let queryString = qs.stringify({
                cono: "10",
                divi: "101",
                reqno: requestNumber,
              });
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/message`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: queryString,
              };
              axios
                .request(config)
                .then((response) => {
                  console.log("FFFFFFFFFFFFFFFFFFF");
                })
                .catch((error) => {
                  console.log(error);
                });
            } else if (rsl[0].H_Status === "30") {
              let queryString = qs.stringify({
                cono: "10",
                divi: "101",
                reqno: requestNumber,
                lineId: req.body.originalDetectIntentRequest.payload.data.source.userId,
              });
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `http://${process.env.HOST_API}:3000/api/v1/unlock/unlockcreditlimit`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: queryString,
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
          } else {
            msg = `ระบบไม่สามารถทำการอนุมัติหมายเลขคำขอเลขที่ ${requestNumber} น้องไม่พบหมายเลขรายการ ก๊าบๆ`;
            stickerObj.packageId = "789";
            stickerObj.stickerId = "10870";
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
              {
                payload: {
                  line: {
                    type: "sticker",
                    packageId: stickerObj.packageId,
                    stickerId: stickerObj.stickerId,
                  },
                },
              },
            ],
          };
        }
        break;
      case "RejectNow":
        {
          let requestNumber = req.body.queryResult.parameters["requestnumber"];
          console.log(requestNumber);

          let sql = `select * from is.requestheader where H_RequestNumber = '${requestNumber}' and H_Status IN ('20','30')`;
          let rsl = await executeSQL(sql);
          let msg = "";
          let stickerObj = {
            type: "sticker",
            packageId: "789",
            stickerId: "10863",
          };

          if (rsl.length > 0) {
            let sqlUpdateStatus = `UPDATE is.requestheader
        SET H_Status = '10'
        where H_CompanyCode = '10'
        and H_DivisionCode = '101'
        and H_RequestNumber  = '${requestNumber}'  
        and cast(H_Status as DECIMAL)in  ('20','30');`;
            let result = await executeSQL(sqlUpdateStatus);
            msg = `ระบบทำการปฏิเสธหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`;
            if (result.changedRows > 0) {
              let lineID =
                req.body.originalDetectIntentRequest.payload.data.source.userId;
              let queryString = qs.stringify({
                lineID: lineID,
                reqno: requestNumber,
              });
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/notireject`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: queryString,
              };
              axios
                .request(config)
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else {
            msg = `ระบบไม่สามารถทำการปฏิเสธหมายเลขคำขอเลขที่ ${requestNumber} น้องไม่พบหมายเลขรายการ ก๊าบๆ`;
            stickerObj.packageId = "789";
            stickerObj.stickerId = "10870";
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
              {
                payload: {
                  line: {
                    type: "sticker",
                    packageId: stickerObj.packageId,
                    stickerId: stickerObj.stickerId,
                  },
                },
              },
            ],
          };
        }
        break;
      case "Reject":
        {
          let requestNumber = req.body.queryResult.parameters["requestnumber"];
          console.log(requestNumber);

          let sql = `select * from is.requestheader where H_RequestNumber = '${requestNumber}' and H_Status IN ('20','30')`;
          let rsl = await executeSQL(sql);
          let msg = "";
          let stickerObj = {
            type: "sticker",
            packageId: "789",
            stickerId: "10863",
          };

          if (rsl.length > 0) {
            let sqlUpdateStatus = `UPDATE is.requestheader
        SET H_Status = '10'
        where H_CompanyCode = '10'
        and H_DivisionCode = '101'
        and H_RequestNumber  = '${requestNumber}'  
        and cast(H_Status as DECIMAL)in  ('20','30');`;
            let result = await executeSQL(sqlUpdateStatus);
            msg = `ระบบทำการปฏิเสธหมายเลขคำขอเลขที่ ${requestNumber} เรียบร้อยแล้ว ก๊าบๆ`;
            if (result.changedRows > 0) {
              let lineID =
                req.body.originalDetectIntentRequest.payload.data.source.userId;
              let queryString = qs.stringify({
                lineID: lineID,
                reqno: requestNumber,
              });
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/notireject`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: queryString,
              };
              axios
                .request(config)
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else {
            msg = `ระบบไม่สามารถทำการปฏิเสธหมายเลขคำขอเลขที่ ${requestNumber} น้องไม่พบหมายเลขรายการ ก๊าบๆ`;
            stickerObj.packageId = "789";
            stickerObj.stickerId = "10870";
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
              {
                payload: {
                  line: {
                    type: "sticker",
                    packageId: stickerObj.packageId,
                    stickerId: stickerObj.stickerId,
                  },
                },
              },
            ],
          };
        }
        break;
      case "ViewDetail":
        {
          let requestNumber = req.body.queryResult.parameters["requestnumber"];
          let lineID =
            req.body.originalDetectIntentRequest.payload.data.source.userId;
          let queryString = qs.stringify({
            lineID: lineID,
            reqno: requestNumber,
          });
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `http://${process.env.HOST_API}:3000/api/v1/chatbot/moredetail`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: queryString,
          };
          axios
            .request(config)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        break;
      default:
    }
  } catch (exception) {
    console.log(exception.message);
  }
  return res.status(200).send(obj);
};
