const { executeSQL } = require("../resource/callMysql");
const config = require("../config/configClient");
const line = require("@line/bot-sdk");
const { flexMessageRequestNotifacation } = require("../template/flexMessage");
const client = new line.Client(config);

module.exports.notiForRequest = async (req, res, next) => {
  try {
    console.log("NotiForRequest");
    const { cono, divi, reqno } = req.body;
    // let strSql = `select  a.H_CompanyCode ,a.H_DivisionCode ,a.H_RequestNumber ,a.H_CustomerCode ,a.H_UserRequest , b.OKCUNM
    // ,s.Sales_UserName , s.Sales_LineID as idApr2 , a.H_Approval1 ,cast(a.H_Status as  DECIMAL) + 10 as Up_Status
    // from is.requestheader a
    // left join m3fdbprd.ocusma b on b.OKCONO = a.H_CompanyCode and  a.H_CustomerCode = b.OKCUNO
    // left join is.salesman s on s.Sales_CompanyCode  = a.H_CompanyCode and a.H_Approval1  = s.Sales_UserName
    // where a.H_CompanyCode = '${cono}'
    // and a.H_DivisionCode = '${divi}'
    // and a.H_RequestNumber = '${reqno}'`;
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
