module.exports.createFlexMessage = async () => {
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
          text: `Customer Code:  ${cusCode} : ${cusName} `,
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
              label: "View detail",
              uri: `${url}/Reject`,
            },
          ],
      }
    };

 
  return flexMessage;
};




const getMessage =  async () => {
  try{
      let defaultSelect = `SELECT PRODUCT_NAME as ProdName, PRODUCT_IMAGE as ProdImg, PRODUCT_PRICE as Price  FROM PRODUCT WHERE PRODUCT_ID = "${prodId}" LIMIT 1`;
      if(isRandom){
          defaultSelect = `SELECT PRODUCT_NAME as ProdName, PRODUCT_IMAGE as ProdImg, PRODUCT_PRICE as Price  FROM PRODUCT ORDER BY RAND() LIMIT 1`
      }
      let result = await query(defaultSelect);
      result = JSON.parse(JSON.stringify(result));
      if(result && result.length > 0){
          return result[0];
      }
  }catch(ex){
      console.log(ex.message);
  }
  if(isRandom){

  }
  return null;
}

module.exports = { getFood };