const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const line = require("@line/bot-sdk");
const { flexMessageRequestNotifacation } = require("../template/flexMessage");
const client = new line.Client(config);
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

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

module.exports.successfuly = async (req, res, next) => {
  try {
    console.log("successfuly");
    const { lineID, reqno } = req.body;
    client
      .pushMessage(lineID, [
        {
          type: "text",
          text: `หมายเลขคำขอปลดล็อคเครดิตเลขที่ ${reqno} ได้ทำการอนุมัติเรียบร้อยเเล้วก๊าบๆ`,
        },
        {
          type: "sticker",
          packageId: "789",
          stickerId: "10873",
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

module.exports.cancel = async (req, res, next) => {
  try {
    console.log("cancel");
    const { lineID, reqno } = req.body;
    client
      .pushMessage(lineID, [
        {
          type: "text",
          text: `หมายเลขคำขอปลดล็อคเครดิตเลขที่ ${reqno} ได้ทำการอนุมัติเรียบร้อยเเล้วก๊าบๆ`,
        },
        {
          type: "sticker",
          packageId: "789",
          stickerId: "10873",
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
    const { lineID } = req.body;
    let sql = `select r.H_CompanyCode , r.H_DivisionCode ,r.H_RequestNumber ,r.H_CustomerCode
    ,case when r.H_Status = '10' then 'not send' 
          when r.H_Status = '20' then 'Wait for approve step 1'
          when r.H_Status = '30' then 'Wait for approve step 2'
          when r.H_Status = '40' then 'Wait for ERP'
          when r.H_Status = '50' then 'Unlocked'
          else 'Status Unknow' end as H_Status ,o.OKCUNM , r.H_TransactionDate
    from is.requestheader r
    join is.salesman s on  r.H_CompanyCode  = s.Sales_CompanyCode 
    and r.H_DivisionCode = s.Sales_Division 
    and r.H_UserRequest = s.Sales_UserName 
    left join m3fdbprd.ocusma o on r.H_CompanyCode = o.OKCONO 
    and r.H_CustomerCode  = o.OKCUNO 
    where r.H_Status not in ('10')
    and s.Sales_LineID = '${lineID}'
    order by r.H_RequestNumber asc limit 10`;
    let results = await executeSQL(sql);
    console.log(results.length);
    var bubbles = [];
    for (var i = 0; i < results.length; i++) {
      // Create a Bubble container
      var bubble = {
        type: "bubble",
        // hero: {
        //   type: "image",
        //   url: "https://cdn.pixabay.com/photo/2017/02/01/09/57/animal-2029283_960_720.png",
        //   size: "full",
        //   aspectRatio: "20:13",
        //   aspectMode: "cover",
        //   action: {
        //     type: "uri",
        //     label: "View details",
        //     uri: "https://vos.line-scdn.net/bot-designer-template-images/event/brown-card.png",
        //   },
        // },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Request No : " + results[i].H_RequestNumber,
                  size: "lg",
                  color: getRandomColor(),
                  weight: "bold",
                  wrap: true,
                },
              ],
              spacing: "none",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${results[i].H_TransactionDate}`,
                  size: "sm",
                  color: "#999999",
                  wrap: true,
                },
              ],
              spacing: "none",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: results[i].H_CustomerCode,
                      size: "md",
                      weight: "bold",
                      color: "#111111",
                      wrap: false,
                      flex: 55,
                    },
                  ],
                  flex: 1,
                  spacing: "sm",
                },
              ],
              spacing: "sm",
              margin: "lg",
              flex: 1,
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: results[i].OKCUNM,
                      size: "sm",
                      weight: "bold",
                      color: "#111111",
                      wrap: false,
                      flex: 55,
                    },
                  ],
                  flex: 1,
                  spacing: "sm",
                },
              ],
              spacing: "sm",
              margin: "lg",
              flex: 1,
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: results[i].H_Status,
                    data: "null", // Specify the LINE MINI App page.
                  },
                  style: "primary",
                  height: "sm",
                  color: "#61C0BF",
                },
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: "Cancel Request",
                    data: `Cancel&${results[i].H_RequestNumber}&99`,
                  },
                  style: "primary",
                  height: "sm",
                  color: "#D64424",
                },
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "View details",
                    // uri: "http://119.59.114.233:8080/CR_Control/login.jsp", // Specify the LINE MINI App page.
                    uri:
                      "http://localhost:8080/CR_Control/P2.jsp?reqno=" +
                      results[i].H_RequestNumber, // Specify the LINE MINI App page.
                  },
                  style: "primary",
                  height: "sm",
                  color: "#BBDED6",
                },
              ],
              spacing: "xs",
              margin: "lg",
            },
          ],
          spacing: "md",
        },
      };

      // Add the Bubble container to the array
      bubbles.push(bubble);
    }
    var carousel = {
      type: "carousel",
      contents: bubbles,
    };
    var flexMessage = {
      type: "flex",
      altText: "รายการติดตามสถานะ",
      contents: carousel,
    };

    client.pushMessage(lineID, flexMessage);

    res.json({ Status: 200, data: "OK" }).status(200).end();
  } catch (error) {
    next(error);
  }
};

module.exports.pendingitems = async (req, res, next) => {
  // /api/v1/data/regitermember
  try {
    const { lineID } = req.body;
    let sql = `select r.H_CompanyCode , r.H_DivisionCode ,r.H_RequestNumber ,r.H_CustomerCode
    ,case when r.H_Status = '10' then 'not send' 
          when r.H_Status = '20' then 'Wait for approve step 1'
          when r.H_Status = '30' then 'Wait for approve step 2'
          when r.H_Status = '40' then 'Wait for ERP'
          when r.H_Status = '50' then 'Unlocked'
          else 'Status Unknow' end as H_Status ,o.OKCUNM , r.H_TransactionDate
    from is.requestheader r
    join is.salesman s on  r.H_CompanyCode  = s.Sales_CompanyCode 
    and r.H_DivisionCode = s.Sales_Division 
    and r.H_UserRequest = s.Sales_UserName 
    left join m3fdbprd.ocusma o on r.H_CompanyCode = o.OKCONO 
    and r.H_CustomerCode  = o.OKCUNO 
    where r.H_Status not in ('10')
    and s.Sales_LineID = '${lineID}'
    order by r.H_RequestNumber asc limit 10`;
    let results = await executeSQL(sql);
    console.log(results.length);
    var bubbles = [];
    for (var i = 0; i < results.length; i++) {
      // Create a Bubble container
      var bubble = {
        type: "bubble",
        // hero: {
        //   type: "image",
        //   url: "https://cdn.pixabay.com/photo/2017/02/01/09/57/animal-2029283_960_720.png",
        //   size: "full",
        //   aspectRatio: "20:13",
        //   aspectMode: "cover",
        //   action: {
        //     type: "uri",
        //     label: "View details",
        //     uri: "https://vos.line-scdn.net/bot-designer-template-images/event/brown-card.png",
        //   },
        // },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Request No : " + results[i].H_RequestNumber,
                  size: "lg",
                  color: getRandomColor(),
                  weight: "bold",
                  wrap: true,
                },
              ],
              spacing: "none",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${results[i].H_TransactionDate}`,
                  size: "sm",
                  color: "#999999",
                  wrap: true,
                },
              ],
              spacing: "none",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: results[i].H_CustomerCode,
                      size: "md",
                      weight: "bold",
                      color: "#111111",
                      wrap: false,
                      flex: 55,
                    },
                  ],
                  flex: 1,
                  spacing: "sm",
                },
              ],
              spacing: "sm",
              margin: "lg",
              flex: 1,
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: results[i].OKCUNM,
                      size: "sm",
                      weight: "bold",
                      color: "#111111",
                      wrap: false,
                      flex: 55,
                    },
                  ],
                  flex: 1,
                  spacing: "sm",
                },
              ],
              spacing: "sm",
              margin: "lg",
              flex: 1,
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "postback",
                    label: results[i].H_Status,
                    data: "null", // Specify the LINE MINI App page.
                  },
                  style: "primary",
                  height: "sm",
                  color: "#61C0BF",
                },
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "View details",
                    uri: "https://liff.line.me/123456-abcedfg/share", // Specify the LINE MINI App page.
                  },
                  style: "primary",
                  height: "sm",
                  color: "#BBDED6",
                },
              ],
              spacing: "xs",
              margin: "lg",
            },
          ],
          spacing: "md",
        },
      };

      // Add the Bubble container to the array
      bubbles.push(bubble);
    }
    var carousel = {
      type: "carousel",
      contents: bubbles,
    };
    var flexMessage = {
      type: "flex",
      altText: "รายการติดตามสถานะ",
      contents: carousel,
    };

    client.pushMessage(lineID, flexMessage);

    res.json({ Status: 200, data: "OK" }).status(200).end();
  } catch (error) {
    next(error);
  }
};
