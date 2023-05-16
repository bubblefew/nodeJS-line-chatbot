module.exports.flexMessageRequestNotifacation = (cusCode, cusName, reqNo) => [
  {
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
        // {
        //   type: "postback",
        //   label: "Approve",
        //   data: `Approve&${reqNo}&${statusUpdate}`,
        // },
        {
          type: "message",
          label: "Approve",
          text: `Approve Request Number : ${reqNo}`,
        },
        {
          type: "message",
          label: "Reject",
          text: `Reject Request Number : ${reqNo}`,
        },
        {
          type: "uri",
          label: "More detail",
          uri: `http://119.59.114.233:8080/CR_Control/P2.jsp?reqno=${reqNo}`,
        },
      ],
      imageAspectRatio: "rectangle",
      imageSize: "cover",
    },
  },
];

module.exports.messagesThankYou = [
  { type: "text", text: "อนุมัติรายการคำขอปลดล็อคเครดิตสำเร็จ !" },
  {
    type: "text",
    text: "ขอบคุณ ก๊าบ ก๊าบ  $$",
    emojis: [
      {
        index: 18,
        productId: "5ac21184040ab15980c9b43a",
        emojiId: "045",
      },
      {
        index: 19,
        productId: "5ac21184040ab15980c9b43a",
        emojiId: "045",
      },
    ],
  },
  { type: "sticker", packageId: "789", stickerId: "10857" },
];

module.exports.messagesCantApprove = [
  { type: "text", text: "ไม่สามารถทำการอัพเดทสถานะได้ก๊าบ" },
  { type: "text", text: "สาเหตุ ถูกอนุมัติเเล้ว ปลดล็อคแล้ว" },
  { type: "sticker", packageId: "6136", stickerId: "10551380" },
];

module.exports.few = [
  {
    type: "template",
    altText: "คำขอรายการปลดล็อคเครดิตลิมิต",
    template: {
      type: "buttons",
      thumbnailImageUrl:
        "https://plus.unsplash.com/premium_photo-1664202219850-0ed2a085aaa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80",
      imageAspectRatio: "rectangle",
      imageSize: "cover",
      imageBackgroundColor: "#FFFFFF",
      title: `Unlock Credit No:`,
      text: `Customer Code:  `,
      defaultAction: {
        type: "uri",
        label: "View detail",
        uri: "http://example.com/page/123",
      },
      actions: [
        // {
        //   type: "postback",
        //   label: "Approve",
        //   data: `Approve&${reqNo}&${statusUpdate}`,
        // },
        {
          type: "message",
          label: "Approve",
          text: `Approve Request Number : `,
        },
        {
          type: "message",
          label: "Reject",
          text: `Reject Request Number : `,
        },
        {
          type: "uri",
          label: "More detail",
          uri: `http://119.59.114.233:8080/CR_Control/P2.jsp?reqno=`,
        },
      ],
      imageAspectRatio: "rectangle",
      imageSize: "cover",
    },
  },
];
