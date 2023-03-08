const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const line = require("@line/bot-sdk");

const client = new line.Client(config);

module.exports.notiForRequest = async (req, res, next) => {
  try {
    console.log("NotiForRequest");
    const { cono, divi, reqno } = req.params;
    let strSql = `select  a.H_CompanyCode ,a.H_DivisionCode ,a.H_RequestNumber ,a.H_CustomerCode ,a.H_UserRequest , b.OKCUNM
    ,s.Sales_UserName , s.Sales_LineID as idApr2 , a.H_Approval1 
    from is.requestheader a
    left join m3fdbprd.ocusma b on b.OKCONO = a.H_CompanyCode and  a.H_CustomerCode = b.OKCUNO
    left join is.salesman s on s.Sales_CompanyCode  = a.H_CompanyCode and a.H_Approval1  = s.Sales_UserName 
    where a.H_CompanyCode = '${cono}'
    and a.H_DivisionCode = '${divi}'
    and a.H_RequestNumber = '${reqno}'`;
    let result = await executeSQL(strSql);
    let cusCode = result[0].H_CustomerCode;
    let cusName = result[0].OKCUNM;
    let reqNo = result[0].H_RequestNumber;
    let lineIdApr1 = result[0].idApr2;
    // const flexMessage = templateFlexMessage(reqNo, cusCode, cusName, "4");
    // const flexMessage = createFlexMessage(reqNo, cusCode, cusName, "4");
    const message = {
      type: "template",
      altText: "คำขอรายการปลดล็อคเครดิตลิมิต",
      template: {
        type: "buttons",
        thumbnailImageUrl:
          "https://plus.unsplash.com/premium_photo-1664202219850-0ed2a085aaa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80",
        imageAspectRatio: "rectangle",
        imageSize: "cover",
        imageBackgroundColor: "#FFFFFF",
        title: `Unlock Credit No: ${reqNo}`,
        text: `Customer Code:  ${cusCode} ${cusName} `,
        defaultAction: {
          type: "uri",
          label: "View detail",
          uri: "http://example.com/page/123",
        },
        actions: [
          {
            type: "postback",
            label: "Approve",
            data: `Approve&${reqNo}`,
          },
          {
            type: "postback",
            label: "Reject",
            data: `Reject&${reqNo}`,
          },
          {
            type: "uri",
            label: "More detail",
            uri: `https://siriphonnot.medium.com/%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87-webhook-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-node-js-%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A-dialogflow-fulfillment-a1a0f61fc52b`,
          },
        ],
        imageAspectRatio: "rectangle",
        imageSize: "cover",
      },
    };

    client
      .pushMessage(lineIdApr1, message)
      .then((res2) => {
        res.status(200).end();
      })
      .catch((err) => {
        // console.error(err);
        res.status(400).end();
      });
    res.status(200).json({
      status_code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
