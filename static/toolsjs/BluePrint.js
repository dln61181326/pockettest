// import Vue from "vue";

// //==============================BluePrintUtil=================================
// const BluePrintUtil = {
//   //是否为空判断
//   showprint(printstate, autoprint, orderItem, orderFrom) {
//     let msg
//     let phone = orderItem.shipMobile
//     phone = changeStr(phone, 3, "****")
//     if (printstate == 0) { //header

//       msg = {
//         "pagewidth": 900,
//         "pageheight": 500,
//         "data": [{
//             "printtype": 99,
//             "x": 0,
//             "y": 28,
//             "printcontent": "http://10.82.25.197:8081/KMS/static/img/watsonslogo.png",
//             "bmpSizeX": 0,
//             "bmpSizeY": 0,
//           },
//           {
//             "printtype": 1,
//             "x": 380,
//             "y": 148,
//             "printcontent": "取货码",
//             "fontSize": 2,
//           },
//           {
//             "printtype": 1,
//             "x": 520,
//             "y": 118,
//             "printcontent": orderItem.gotCode,
//             "fontSize": 6,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 4,
//             "x": 10,
//             "y": 138,
//             "printcontent": orderItem.orderNo,
//             "bartype": 128,
//             "barrotate": false,
//             "height": 60
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 200,
//             "printcontent": orderItem.orderNo,
//             "fontSize": 2,
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 248,
//             "printcontent": "销售渠道",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 248,
//             "printcontent": orderFrom,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 288,
//             "printcontent": "顾客姓名",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 288,
//             "printcontent": orderItem.shipName,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 328,
//             "printcontent": "订单日期",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 328,
//             "printcontent": orderItem.orderDate,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 368,
//             "printcontent": "预约配送时间",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 368,
//             "printcontent": orderItem.expectedDeliveryTime,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 260,
//             "y": 248,
//             "printcontent": "执货点",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 370,
//             "y": 248,
//             "printcontent": orderItem.storeNo,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 260,
//             "y": 288,
//             "printcontent": "配送方",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 370,
//             "y": 288,
//             "printcontent": orderItem.expressName,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 520,
//             "y": 248,
//             "printcontent": "联系电话",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 640,
//             "y": 248,
//             "printcontent": phone,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 520,
//             "y": 288,
//             "printcontent": "快递单号",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 640,
//             "y": 288,
//             "contentWidth": 450,
//             "contentHeight": 200,
//             "printcontent": orderItem.logisticsExpressNo,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },

//         ]


//       }
//     } else {
//       let itemheight = 120;
//       let h = 75;
//       let orderAmt = new Number(orderItem.orderAmt)
//       msg = {
//         "pagewidth": 1000,
//         "pageheight": 1300 + 120 * orderItem.orderItem.length,

//         "data": [{
//             "printtype": 98,
//             "x": 0,
//             "y": 28,
//             "printcontent": "http://10.82.25.197:8081/KMS/static/img/watsonslogo.png",
//             "bmpSizeX": 0,
//             "bmpSizeY": 0,
//           },
//           {
//             "printtype": 4,
//             "x": 10,
//             "y": 118,
//             "printcontent": orderItem.orderNo,
//             "bartype": 128,
//             "barrotate": false,
//             "height": 60
//           },
//           {
//             "printtype": 1,
//             "x": 40,
//             "y": 180,
//             "printcontent": orderItem.orderNo,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 600,
//             "y": 180,
//             "printcontent": "屈臣氏闪电送订单",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 300,
//             "y": 220,
//             "printcontent": "商品清单",
//             "fontSize": 4,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 310,
//             "printcontent": "销售渠道",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 360,
//             "printcontent": "订单日期",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 410,
//             "printcontent": "配送方",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 460,
//             "printcontent": "执货点",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 310,
//             "printcontent": orderFrom,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 360,
//             "printcontent": orderItem.orderDate,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 410,
//             "printcontent": orderItem.expressName,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },
//           {
//             "printtype": 1,
//             "x": 140,
//             "y": 460,
//             "printcontent": orderItem.storeNo,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },
//           {
//             "printtype": 1,
//             "x": 430,
//             "y": 310,
//             "printcontent": "顾客姓名",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 430,
//             "y": 360,
//             "printcontent": "快递单号",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 430,
//             "y": 410,
//             "printcontent": "联系电话",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 10,
//             "y": 510,
//             "printcontent": "预约配送时间",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },

//           {
//             "printtype": 1,
//             "x": 540,
//             "y": 310,
//             "printcontent": orderItem.shipName,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },

//           {
//             "printtype": 1,
//             "x": 540,
//             "y": 360,
//             "printcontent": orderItem.logisticsExpressNo,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },

//           {
//             "printtype": 1,
//             "x": 540,
//             "y": 410,
//             "printcontent": phone,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },


//           {
//             "printtype": 1,
//             "x": 160,
//             "y": 510,
//             "printcontent": orderItem.expectedDeliveryTime,
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": true
//           },

//           {
//             "printtype": 1,
//             "x": 25,
//             "y": 510 + 60,
//             "printcontent": "序号",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 125 - 30,
//             "y": 510 + 60,
//             "printcontent": "商品条码",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 345 - 30,
//             "y": 510 + 60,
//             "printcontent": "商品名称",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 580 - 5,
//             "y": 510 + 60,
//             "printcontent": "单价",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 655,
//             "y": 510 + 60,
//             "printcontent": "数量",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 750,
//             "y": 510 + 60,
//             "printcontent": "金额",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },

//           {
//             "printtype": 5,
//             "linewidth": 1,
//             "startx": 10,
//             "starty": 510 + 60 + 30,
//             "endx": 850,
//             "endy": 510 + 60 + 30,
//             "fullline": false
//           },

//           {
//             "printtype": 1,
//             "x": 25,
//             "y": (h * orderItem.orderItem.length) + 510 + 140,
//             "printcontent": "共计",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 35 + 80 + 120 + 380 + 70 + 70 - 10,
//             "y": (h * orderItem.orderItem.length) + 510 + 140,
//             "printcontent": orderAmt.toFixed(2),
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 1,
//             "x": 25,
//             "y": (h * orderItem.orderItem.length) + 510 + 230,
//             "printcontent": "备注",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 1,
//             "reverse": false,
//             "underline": false
//           },
//           {
//             "printtype": 5,
//             "linewidth": 1,
//             "startx": 10,
//             "starty": (h *orderItem.orderItem.length) + 510 + 100 + 230 + 60,
//             "endx": 800,
//             "endy": h * Number(orderItem.orderItem.length) + 510 + 100 + 230 + 60,
//             "fullline": false
//           },




//         ]
//       }




//       let s = 0;
//       for (let a = 0; a < orderItem.orderItem.length; a++) {
//         let orderQty = orderItem.orderItem[a].orderQty
//         let actualPrice = new Number(orderItem.orderItem[a].actualPrice)
//         console.log("===actualPrice==" + actualPrice)
//         let singleAmount = Number(orderItem.orderItem[a].orderQty) * Number(orderItem.orderItem[a].actualPrice)
//         console.log("===singleAmount==" + singleAmount)

//         // =========单价=========
//         let singlealignnum = 0
//         let i = parseInt(actualPrice);
//         let l = 0;
//         while (i >= 1) {
//           i = i / 10;
//           l++;
//         }
//         if (l == 1 || l == 0) {
//           singlealignnum = singlealignnum + 10
//           console.log("singlealignnum  1====" + "+ 10")
//         } else if (l == 3) {
//           singlealignnum = singlealignnum - 20
//           console.log("singlealignnum  3====" + "- 15")

//         } else if (l >= 4) {
//           singlealignnum = singlealignnum - 25
//           console.log("singlealignnum  4====" + "- 25")

//         }

//         // ==========金额================
//         let amountalignnum = 0
//         let b = parseInt(singleAmount);
//         let c = 0;
//         while (b >= 1) {
//           b = b / 10;
//           c++;
//         }

//         if (c == 1 || c == 0) {
//           amountalignnum = amountalignnum + 10
//           console.log("amountalignnum  1====" + "+ 15")
//         } else if (c == 3) {
//           amountalignnum = amountalignnum - 15
//           console.log("amountalignnum  3====" + "- 15")

//         } else if (c >= 4) {
//           amountalignnum = amountalignnum - 25
//           console.log("amountalignnum  4====" + "- 30")

//         }

//         console.log("singlealignnum-----------" + singlealignnum)
//         msg.data.push({
//           "printtype": 1,
//           "x": 35,
//           "y": h * a + 510 + 60 + 50,
//           "printcontent": a + 1,
//           "contentWidth": 750,
//           "contentHeight": 400,
//           "fontSize": 2,
//           "rotate": 0,
//           "bold": 0,
//           "reverse": false,
//           "underline": false
//         }, {
//           "printtype": 1,
//           "x": 35 + 80 - 30,
//           "y": h * a + 510 + 60 + 50,
//           "printcontent": orderItem.orderItem[a].itemNo,
//           "fontSize": 2,
//           "rotate": 0,
//           "bold": 0,
//           "reverse": false,
//           "underline": false
//         }, {
//           "printtype": 1,
//           "x": 35 + 80 + 120 - 30,
//           "y": h * a + 510 + 60 + 50,
//           "contentWidth": 330,
//           "contentHeight": 900,
//           "printcontent": orderItem.orderItem[a].itemName,
//           "fontSize": 2,
//           "rotate": 0,
//           "bold": 0,
//           "reverse": false,
//           "underline": false
//         }, {
//           "printtype": 1,
//           "x": 35 + 80 + 120 + 350 - 10 + singlealignnum,
//           "y": h * a + 510 + 60 + 50,
//           "printcontent": new Number(orderItem.orderItem[a].actualPrice).toFixed(2),
//           "fontSize": 2,
//           "rotate": 0,
//           "bold": 0,
//           "reverse": false,
//           "underline": false
//         }, {
//           "printtype": 1,
//           "x": 35 + 80 + 120 + 380 + 70 - 10,
//           "y": h * a + 510 + 60 + 50,
//           "printcontent": orderItem.orderItem[a].orderQty,
//           "fontSize": 2,
//           "rotate": 0,
//           "bold": 0,
//           "reverse": false,
//           "underline": false
//         }, {
//           "printtype": 1,
//           "x": 35 + 80 + 120 + 380 + 70 + 70 - 10 + amountalignnum,
//           "y": h * a + 510 + 60 + 50,
//           "printcontent": singleAmount.toFixed(2),
//           "fontSize": 2,
//           "rotate": 0,
//           "bold": 0,
//           "reverse": false,
//           "underline": false
//         }, )
//         s = a;
//       }



//       let changecode = 3
//       let qrcode = 3
//       if (orderFrom.startsWith("天猫")) {
//         qrcode = 1
//         changecode = 2

//       } else if (orderItem.orderFrom == "京东") {
//         qrcode = 2
//         changecode = 2
//       } else if (orderItem.orderFrom == "京东到家") {
//         qrcode = 5
//         changecode = 2
//       } else if (orderItem.orderFrom.startsWith("云店")) {
//         qrcode = 4
//         changecode = 5

//       } else if (orderFrom == "美团" || orderFrom == "饿了么") {
//         changecode = 4
//       } else if (orderFrom.startsWith("莴笋") || orderFrom.startsWith("试用瓶")) {
//         changecode = 3
//       }

//       msg.data.push({
//         "printtype": 1,
//         "x": 200,
//         // "y": (h * orderItem.orderItem.length) + 510 + 100 + 200,
//         "y": (h * orderItem.orderItem.length) + 510 + 100 + 200 + 100,
//         "printcontent": "尊敬的顾客，如您对订单有任何疑问",
//         "fontSize": 2,
//         "rotate": 0,
//         "bold": 0,
//         "reverse": false,
//         "underline": false
//       }, {

//         "printtype": 1,
//         "x": 75,
//         // "y": (h * orderItem.orderItem.length) + 510 + 100 + 200,
//         "y": (h * orderItem.orderItem.length) + 510 + 100 + 200 + 150,
//         "printcontent": `请联系在线客服或致电屈臣氏客服4008301310（移动电话拨打）转${changecode}`,
//         "fontSize": 2,
//         "rotate": 0,
//         "bold": 0,
//         "reverse": false,
//         "underline": false
//       }, )

//       if (qrcode == 3) { //三个二维码
//         msg.data.push({
//             "printtype": 1,
//             "x": 40,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 110,
//             "contentWidth": 600,
//             "contentHeight": 400,
//             "printcontent": "下载屈臣氏APP",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 1,
//             "x": 30,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150,
//             "contentWidth": 600,
//             "contentHeight": 400,
//             "printcontent": "全球美妆1小时闪送到家",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 3,
//             "x": 60,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
//             "printcontent": "https://a.app.qq.com/o/simple.jsp?pkgname=com.watsons.mobile",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           },

//           {
//             "printtype": 1,
//             "x": 375,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 110,
//             "printcontent": "满99减25",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 1,
//             "x": 300,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150,
//             "printcontent": "扫码发关键字【优惠券】领取",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 3,
//             "x": 350,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
//             "printcontent": "http://weixin.qq.com/q/029BuWYvgjbo_10000M07I",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           },

//           {
//             "printtype": 1,
//             "x": 640,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 110,
//             "printcontent": "如需申请电子发票",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 1,
//             "x": 640,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150,
//             "printcontent": "请扫下方二维码",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 3,
//             "x": 640,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
//             "printcontent": "https://h5.watsons.com.cn/act/2018/1018_invoice/?f=CNDdeliveryreceipt-invoice20191230",
//             "rotate": 0,
//             "qrver": 1,
//             "qrlel": 0,
//           },
//         )
//       } else if (qrcode == 1) { //天猫cnc 天猫cnd
//         msg.data.push({
//             "printtype": 1,
//             "x": 330,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 110,
//             "printcontent": "扫码获取更多优惠资讯",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           }, {
//             "printtype": 3,
//             "x": 350,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150,
//             "printcontent": "https://m.tb.cn/Q.109c0",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           },

//         )
//       } else if (qrcode == 2) { // 京东
//         msg.data.push({
//             "printtype": 3,
//             "x": 350,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150,
//             "printcontent": "http://qr02.cn/EDsGVt",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           },


//         )
//       } else if (qrcode == 5) { // 京东到家
//         msg.data.push({
//             "printtype": 3,
//             "x": 350,
//             "y": h * orderItem.orderItem.length + 510 + 390 + 150,
//             "printcontent": "http://dj-store-gw.jd.com/qrcode/qrCodeRedirect?type=1&linkId=329840",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           },


//         )
//       } else if (qrcode == 4) { //两个二维码
//         msg.data.push({
//             "printtype": 1,
//             "x": 150,
//             "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 100,
//             "contentWidth": 600,
//             "contentHeight": 400,
//             "printcontent": "添加你的美丽顾问",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 1,
//             "x": 120,
//             "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150,
//             "contentWidth": 600,
//             "contentHeight": 400,
//             "printcontent": "超新超火超值好物专属推荐",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 3,
//             "x": 150,
//             "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150 + 50,
//             "printcontent": "http://weixin.qq.com/q/02zpFu4SqAb5T10000007i",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           },



//           {
//             "printtype": 1,
//             "x": 580,
//             "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 100,
//             "printcontent": "屈臣氏会员",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 1,
//             "x": 520,
//             "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150,
//             "printcontent": "超值权益，一年省超￥800",
//             "fontSize": 2,
//             "rotate": 0,
//             "bold": 0,
//             "reverse": false,
//             "underline": false
//           }, {
//             "printtype": 3,
//             "x": 550,
//             "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150 + 50,
//             "printcontent": "http://weixin.qq.com/q/02J21S5AqAb5T10000M073",
//             "rotate": 0,
//             "qrver": 2,
//             "qrlel": 0,
//           },
//         )

//       }




//     }
//   },
//   changeStr(str, index, changeStr) {
//     return str.substr(0, index) + changeStr + str.substr(index + changeStr.length);
//   },
// };
// Vue.prototype.BluePrintUtil = BluePrintUtil;
// //==============================BluePrintUtil=================================


// export default {};
