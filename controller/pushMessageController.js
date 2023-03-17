const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const line = require("@line/bot-sdk");
const { flexMessageRequestNotifacation } = require("../template/flexMessage");
const client = new line.Client(config);

module.exports.notiForRequest = async (req, res, next) => {
  try {
    console.log("NotiForRequest");
    const { cono, divi, reqno } = req.body;
    let strSql = `select  a.H_CompanyCode ,a.H_DivisionCode ,a.H_RequestNumber ,a.H_CustomerCode ,a.H_UserRequest , b.OKCUNM
    ,s.Sales_UserName , s.Sales_LineID as idApr2 , a.H_Approval1 ,cast(a.H_Status as  DECIMAL) + 10 as Up_Status
    from is.requestheader a
    left join m3fdbprd.ocusma b on b.OKCONO = a.H_CompanyCode and  a.H_CustomerCode = b.OKCUNO
    left join is.salesman s on s.Sales_CompanyCode  = a.H_CompanyCode 
    and case when a.H_Status = '20' then a.H_Approval1 when a.H_Status = '30' then a.H_Approval2 else '-' end = s.Sales_UserName 
    where a.H_CompanyCode = '${cono}'
    and a.H_DivisionCode = '${divi}'
    and a.H_RequestNumber = '${reqno}'`;
    let result = await executeSQL(strSql);
    console.log(result);
    client
      .pushMessage(
        result[0].idApr2,
        flexMessageRequestNotifacation(
          result[0].H_CustomerCode,
          result[0].OKCUNM,
          result[0].H_RequestNumber,
          result[0].Up_Status
        )
      )
      .then((res2) => {
        res.status(200).json({
          status_code: 200,
          data: res2,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status_code: 400,
          data: "error function notiForRequest",
        });
      });
  } catch (error) {
    next(error);
  }
};

module.exports.notiForRegister = async (req, res, next) => {
  try {
    console.log("notiForRegister");
    const { lineID } = req.body;
    client
      .pushMessage(lineID, [
        {
          type: "text",
          text: "ขอบคุณนะก๊าบ สำหรับการเป็นสมาชิก\nคุณสามารถทำการรายการขอปลดล็อคเครดิตได้แล้วนะก๊าบๆ",
        },
        {
          type: "sticker",
          packageId: "11537",
          stickerId: "52002736",
        },
        {
          type: "text",
          text: "สามารถขอรายการปลดล็อคตามลิ้งค์ด้านล่างนี้ได้เลยนะก๊าบๆ",
        },
        {
          type: "text",
          text: "http://119.59.114.233:8080/CR_Control/login.jsp",
        },
      ])
      .then((res2) => {
        res.status(200).json({
          status_code: 200,
          data: res2,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status_code: 400,
          data: "error function notiForRequest",
        });
      });
  } catch (error) {
    next(error);
  }
};

module.exports.tracking = async (req, res, next) => {
  // /api/v1/data/regitermember
  try {
    // const { username, password, staffcode, firstname, lastname, lineid } =
    //   req.body;
    let sql = `select r.*
    from is.requestheader   r, is.salesman s 
    where r.H_CompanyCode  = s.Sales_CompanyCode 
    and r.H_DivisionCode = s.Sales_Division 
    and r.H_UserRequest = s.Sales_UserName 
    and r.H_Status not in ('10')
    and s.Sales_LineID = 'U0d0e9e32d50828492ca9a9426c15f3d0'
    order by r.H_RequestNumber asc `;
    let rsl = await executeSQL(sql);
    if (rsl) {
      let lineID = "U0d0e9e32d50828492ca9a9426c15f3d0";
      client
        .pushMessage(lineID, {
          type: "template",
          altText: "this is a carousel template",
          template: {
            type: "carousel",
            imageSize: "contain",
            columns: [
              {
                thumbnailImageUrl:
                  "https://vos.line-scdn.net/bot-designer-template-images/event/brown-card.png",
                title: "LINE Brown Card",
                text: "A Mart 15% discount",
                actions: [
                  {
                    type: "message",
                    label: "Choose LINE Card",
                    text: "Choose LINE Brown Card",
                  },
                ],
              },
              {
                thumbnailImageUrl:
                  "https://vos.line-scdn.net/bot-designer-template-images/event/cony-card.png",
                title: "LINE Cony Card",
                text: "A Mart 10% discount",
                actions: [
                  {
                    type: "message",
                    label: "Choose LINE Card",
                    text: "Choose LINE Cony Card",
                  },
                ],
              },
              {
                thumbnailImageUrl:
                  "https://vos.line-scdn.net/bot-designer-template-images/event/sally-card.png",
                title: "LINE Sally Card",
                text: "A Mart 15% Mileage",
                actions: [
                  {
                    type: "message",
                    label: "Choose LINE Card",
                    text: "Choose LINE Sally Card",
                  },
                ],
              },
              {
                thumbnailImageUrl:
                  "https://vos.line-scdn.net/bot-designer-template-images/event/choco-card.png",
                title: "LINE Choco Card",
                text: "A Mart 10% Mileage",
                actions: [
                  {
                    type: "message",
                    label: "Choose LINE Card",
                    text: "Choose LINE Choco Card",
                  },
                ],
              },
            ],
          },
        })
        .then((res2) => {
          res.json({
            status_code: 200,
            data: "Successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          // res.status(400).json({
          //   status_code: 400,
          //   data: "error function notiForRequest",
          // });
        });
    }
  } catch (error) {
    next(error);
  }
};
