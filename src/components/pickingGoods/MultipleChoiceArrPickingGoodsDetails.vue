<template>

  <div class="index">


    <div class="top">

      <nav class="navbar navbar-inverse navbar-fixed-top title">
        <img class="backPoint clearfix:after" src="../../assets/backPoint.png" @click="goBack()">
        <!-- 分拣货品列表 -->
        <div id="title" class="titlename">{{multitle}}</div>


        <div class="clearfix"></div>
      </nav>

      <div class="four" v-if="UnavailableState">

        已提交缺货报告
      </div>
      <!-- 
      <div id="DetailsTitle" class="navbar navbar-inverse navbar-fixed-top ">
        <div class="orderlist">
          <div class="totalprice">{{goodsName}}</div>

          <div class="list2">
            <div class="paramidBox">

              <div class="paramtitle">陈列图：{{paramId}}</div>
              <div class="paramtxt"></div> 
            <div class="">共 <span class="totalcount">5件</span> 件商品</div> 
            </div>


          </div>

        </div>
      </div> -->
    </div>


    <div class="thirdBox">
      <div id="third">
        <div class="orderlist">
          <div class="orderlistContent" v-for="(dataList,index) in pickinglist">
            <div :id="forpocketID(index)" class="pocketID">#{{dataList.pocketID}}</div>
            <div class="goodslist1">
              <div class="goodsordernum">{{dataList.orderNo}}</div>
              <div class="goodsmoudle">{{dataList.planogram_id}}</div>
              <!-- v-if="moudleismore(index)" -->
              <span :id="forId(index)" class="moreplanogram" @click="showgoodsmoudle(index,$event)">...</span>
              <input class="clearfix:after" :id="goodsstateforId(index)"
                v-bind:class="[goodsstate[index] ? pickinggoodsstate : okgoodsstate ]" v-model="goodsstateText[index]"
                readonly="readonly"></input>

              <div class="clearfix"></div>

            </div>
            <div class="goodslist2">

              <div class="orderName">{{dataList.itemName}}</div>
              <div class="goodsprice clearfix:after">
                <span class="shortcount"
                  v-if="dataList.AfterShortageGoodsCount>=0">x{{dataList.AfterShortageGoodsCount}}</span>
                <span v-bind:class="[dataList.AfterShortageGoodsCount>=0 ? quantityCount : quantityCountAfter ]"
                  class="">x{{dataList.orderQty}}</span>
                <!-- <span class="quantityCount">x4</span> -->

              </div>
              <div class="clearfix"></div>
            </div>
            <div class="goodslist3" :id="goodslist3(index)">
              <span class="scanCount">扫描数量</span>
              <span class="cut" @click="cutCount(index)">-</span>
              <input class="count" type="number" v-on:blur="onbl(index)" v-on:focus="inputfocus(index)"
                v-model="goodsCount[index]" onkeyup="this.value=this.value.replace(/\D/g,'')"
                onafterpaste="this.value=this.value.replace(/\D/g,'')">
              <span class="add" @click="addCount(index)">+</span>

              <div class="goodlist4" v-if="goodlist4show(index)" @click="closeselecttips(index)">
                <span>{{dataList.reasonText}}</span>
                <!-- <input   v-model="shortpickreasontext[index]" readonly="readonly"></input> -->
                <img class="goodlist4point " src="../../assets/backPoint.png">
              </div>

              <!-- <span class="quantity ">
                         x
                         <span class="quantityCount">{{dataList.orderQty}}</span>
                         
                       </span> -->
              <div class="clearfix"></div>
            </div>

          </div>


        </div>



      </div>
      <div class="ButtonGroup">

        <div id="pickbutton" class="goodsTipsButton clearfix:after" v-if="keyboardshow" @click="gopicking()">完成分拣</div>
        <div id="nopickbutton" class="goodsTipsButton clearfix:after" v-if="keyboardshow" @click="toShortage()">部分缺货分拣
        </div>
        <div class="clearfix"></div>

      </div>
    </div>
    <div class="maskBoxblack TipsMask" v-if="showScanPocketstate">
      <span class="TipsBox maskBox">
        <div class="PocketDiv">

          <div class="PocketTitle">
            请扫描袋号
          </div>
          <input type="text" class="PocketNum" onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')">
          <div id="closePocketDiv" @click="showScanPocketstate=!showScanPocketstate">
            <img class="closeImg " src="../../assets/backPoint.png">
          </div>
        </div>
      </span>
    </div>



    <div v-if="showselectstate" class="spec-menu">
      <div class="spec-menu-box">
        <div class="spec-menu-middle">
          <div class="nature-box">
            <div class="pro-att clear">
              <span class="spec-tit">缺货原因:</span>
              <!-- v-for="(dataList,index) in changnnellistCN" -->
              <img class="closeselect " src="../../assets/close.png" @click="closeselecttips('a')">

              <p>
                <span :id="getreasonid(1)" @click="selectReason(1)">库存缺货</span>
                <span :id="getreasonid(2)" @click="selectReason(2)">近效期或破损</span></p>
              </p>
            </div>
          </div>
        </div>
        <!-- /规格、属性 -->
        <!-- 按钮 -->
        <div class="spec-menu-btn clear">
          <span href="#" class="confirmSelect" @click="choicereason()">确定</span>
        </div>
        <!-- /按钮 -->
      </div>
    </div>

  </div>


</template>

<script>
  import $ from 'jquery'
  import Router from "../../router/index";
  import store from '../../vuex/store';
  import axios from 'axios';

  export default {
    data() {
      return {
        multitle: "分拣货品列表",
        tolistpage: false,
        showselectstate: false,
        goodsCount: [],
        UnavailableItemState: false,
        PrintType: true, //选择 Header or Detail
        changnnellist: ["", "WS", "WSMT", "WSELM", "TM", "JD", "JDDJMZ", "JDDJYD", "VM", "7LK", "JK", "BASTORE", "PZ",
          "MYSTORE", "ZCS_TB", "OTHER",'TM_SM'
        ],
        changnnellistCN: ["全部", "莴笋自营", "莴笋美团", "莴笋饿了么", "天猫商城", "京东商城", "京东到家美妆", "京东到家药店", "自动售货机", "七乐康平台", "平安好医生",
          "云店", "积分商城", "云店2.0", "试用瓶", "其他","天猫超市"
        ],
        readypicking: false,
        allItemList: [],
        keyboardshow: true,
        planogram: [],
        picklistitem: [],
        Shortage: {}, //缺货字段
        UnaGoodSCount: [],
        expectedDeliveryTime: store.state.orderItem.expectedDeliveryTime,
        orderAmt: store.state.orderItem.orderAmt,
        orderNo: store.state.orderItem.orderNo,
        goodsmoudlecount: true,
        goodstotalcount: 0,
        planogramId: [],
        selectReasonoption: "",
        showCamera: true,
        pickingstate: false,
        orderDate: store.state.orderItem.orderDate,
        orderFrom: store.state.orderItem.channelCodeCN==undefined?"未知渠道":store.state.orderItem.channelCodeCN,
        scanbarcode: "",
        ordertotalcount: 0,
        shortpickreasontext: [],
        // shortpickreasontext:"缺货原因",
        p360itemcode: "", //
        orderlockstate: "",
        checkstate: "", //捉取sendState 拣货状态
        tipsstate: "",
        selectindex: "",
        goodsstate: [],
        reasonselect: [],
        pickinggoodsstate: "pickinggoodsstate",
        okgoodsstate: "okgoodsstate",
        goodsstateText: [],
        reasonarr: ["1001", "1002"],
        showScanPocketstate: false,
        orderItem: store.state.orderItem,
        pickinglist: [],
        unaorder: "unaorder",
        unacheck: "unacheck",
        UnavailableState: false,
        quantityCount: "quantityCount",
        quantityCountAfter: "quantityCountAfter",
        goodsName: "洗头水",
        paramId: "",
        curUnaState: "0"
      }
    },

    methods: {
      forpocketID(i) {
        this.$set(this.pickinglist[i], "pocketID", 1 + Number(this.$store.state.MultipleOrderList.findIndex((value) =>
          value.orderNo == this.pickinglist[i].orderNo)))

      },
      changeStr(str, index, changeStr) {
        return str.substr(0, index) + changeStr + str.substr(index + changeStr.length);
      },

      showprint(printstate, autoprint) {
        let msg
        let phone = this.orderItem.shipMobile
        phone = this.changeStr(phone, 3, "****")
        if (printstate == 0) { //header

          msg = {
            "pagewidth": 900,
            "pageheight": 500,
            "data": [{
                "printtype": 99,
                "x": 0,
                "y": 28,
                "printcontent": "http://10.82.25.197:8081/KMS/static/img/watsonslogo.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
              {
                "printtype": 1,
                "x": 380,
                "y": 148,
                "printcontent": "取货码",
                "fontSize": 2,
              },
              {
                "printtype": 1,
                "x": 520,
                "y": 118,
                "printcontent": this.orderItem.gotCode,
                "fontSize": 6,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 4,
                "x": 10,
                "y": 138,
                "printcontent": this.orderNo,
                "bartype": 128,
                "barrotate": false,
                "height": 60
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 200,
                "printcontent": this.orderNo,
                "fontSize": 2,
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 248,
                "printcontent": "销售渠道",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 248,
                "printcontent": this.orderFrom,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 288,
                "printcontent": "顾客姓名",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 288,
                "printcontent": this.orderItem.shipName,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 328,
                "printcontent": "订单日期",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 328,
                "printcontent": this.orderDate,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 368,
                "printcontent": "预约配送时间",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 368,
                "printcontent": this.expectedDeliveryTime,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 260,
                "y": 248,
                "printcontent": "执货点",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 370,
                "y": 248,
                "printcontent": this.$store.state.storeNum,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 260,
                "y": 288,
                "printcontent": "配送方",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 370,
                "y": 288,
                "printcontent": this.orderItem.expressName,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 500,
                "y": 248,
                "printcontent": "联系电话",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 600,
                "y": 248,
                "printcontent": phone,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 500,
                "y": 288,
                "printcontent": "快递单号",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 600,
                "y": 288,
                "contentWidth": 450,
                "contentHeight": 200,
                "printcontent": this.orderItem.logisticsExpressNo,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },

            ]


          }
        } else {
          let itemheight = 120;
          let h = 75;
          let orderAmt = new Number(this.orderAmt)
          msg = {
            "pagewidth": 1000,
            "pageheight": 1300 + 120 * this.pickinglist.length,

            "data": [{
                "printtype": 98,
                "x": 0,
                "y": 28,
                "printcontent": "http://10.82.25.197:8081/KMS/static/img/watsonslogo.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
              {
                "printtype": 2,
                "x": 300,
                "y": 28,
                "printcontent": "http://10.82.25.197:8081/KMS/static/img/noreason.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
              {
                "printtype": 4,
                "x": 10,
                "y": 118,
                "printcontent": this.orderNo,
                "bartype": 128,
                "barrotate": false,
                "height": 60
              },
              {
                "printtype": 1,
                "x": 40,
                "y": 180,
                "printcontent": this.orderNo,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 600,
                "y": 180,
                "printcontent": "屈臣氏闪电送订单",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 300,
                "y": 220,
                "printcontent": "商品清单",
                "fontSize": 4,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 310,
                "printcontent": "销售渠道",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 360,
                "printcontent": "订单日期",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 410,
                "printcontent": "配送方",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 460,
                "printcontent": "执货点",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 310,
                "printcontent": this.orderFrom,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 360,
                "printcontent": this.orderDate,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 410,
                "printcontent": this.orderItem.expressName,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },
              {
                "printtype": 1,
                "x": 140,
                "y": 460,
                "printcontent": this.$store.state.storeNum,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },
              {
                "printtype": 1,
                "x": 430,
                "y": 310,
                "printcontent": "顾客姓名",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 430,
                "y": 360,
                "printcontent": "快递单号",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 430,
                "y": 410,
                "printcontent": "联系电话",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 510,
                "printcontent": "预约配送时间",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },

              {
                "printtype": 1,
                "x": 540,
                "y": 310,
                "printcontent": this.orderItem.shipName,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },

              {
                "printtype": 1,
                "x": 540,
                "y": 360,
                "printcontent": this.orderItem.logisticsExpressNo,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },

              {
                "printtype": 1,
                "x": 540,
                "y": 410,
                "printcontent": phone,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },


              {
                "printtype": 1,
                "x": 160,
                "y": 510,
                "printcontent": this.expectedDeliveryTime,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": true
              },

              {
                "printtype": 1,
                "x": 25,
                "y": 510 + 60,
                "printcontent": "序号",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 125 - 30,
                "y": 510 + 60,
                "printcontent": "商品条码",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 345 - 30,
                "y": 510 + 60,
                "printcontent": "商品名称",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 580 - 5,
                "y": 510 + 60,
                "printcontent": "单价",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 655,
                "y": 510 + 60,
                "printcontent": "数量",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 750,
                "y": 510 + 60,
                "printcontent": "金额",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },

              {
                "printtype": 5,
                "linewidth": 1,
                "startx": 10,
                "starty": 510 + 60 + 30,
                "endx": 850,
                "endy": 510 + 60 + 30,
                "fullline": false
              },

              {
                "printtype": 1,
                "x": 25,
                "y": (h * this.pickinglist.length) + 510 + 140,
                "printcontent": "共计",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 35 + 80 + 120 + 380 + 70 + 70 - 10,
                "y": (h * this.pickinglist.length) + 510 + 140,
                "printcontent": orderAmt.toFixed(2),
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 25,
                "y": (h * this.pickinglist.length) + 510 + 230,
                "printcontent": "备注",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 5,
                "linewidth": 1,
                "startx": 10,
                "starty": (h * this.pickinglist.length) + 510 + 100 + 230 + 60,
                "endx": 800,
                "endy": h * Number(this.pickinglist.length) + 510 + 100 + 230 + 60,
                "fullline": false
              },




            ]
          }




          let s = 0;
          for (let a = 0; a < this.pickinglist.length; a++) {
            let orderQty = this.pickinglist[a].orderQty
            let actualPrice = new Number(this.pickinglist[a].actualPrice)
            console.log("===actualPrice==" + actualPrice)
            let singleAmount = Number(this.pickinglist[a].orderQty) * Number(this.pickinglist[a].actualPrice)
            console.log("===singleAmount==" + singleAmount)

            // =========单价=========
            let singlealignnum = 0
            let i = parseInt(actualPrice);
            let l = 0;
            while (i >= 1) {
              i = i / 10;
              l++;
            }
            if (l == 1 || l == 0) {
              singlealignnum = singlealignnum + 10
              console.log("singlealignnum  1====" + "+ 10")
            } else if (l == 3) {
              singlealignnum = singlealignnum - 20
              console.log("singlealignnum  3====" + "- 15")

            } else if (l >= 4) {
              singlealignnum = singlealignnum - 25
              console.log("singlealignnum  4====" + "- 25")

            }

            // ==========金额================
            let amountalignnum = 0
            let b = parseInt(singleAmount);
            let c = 0;
            while (b >= 1) {
              b = b / 10;
              c++;
            }

            if (c == 1 || c == 0) {
              amountalignnum = amountalignnum + 10
              console.log("amountalignnum  1====" + "+ 15")
            } else if (c == 3) {
              amountalignnum = amountalignnum - 15
              console.log("amountalignnum  3====" + "- 15")

            } else if (c >= 4) {
              amountalignnum = amountalignnum - 25
              console.log("amountalignnum  4====" + "- 30")

            }

            console.log("singlealignnum-----------" + singlealignnum)
            msg.data.push({
              "printtype": 1,
              "x": 35,
              "y": h * a + 510 + 60 + 50,
              "printcontent": a + 1,
              "contentWidth": 750,
              "contentHeight": 400,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 - 30,
              "y": h * a + 510 + 60 + 50,
              "printcontent": this.pickinglist[a].itemNo,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 - 30,
              "y": h * a + 510 + 60 + 50,
              "contentWidth": 330,
              "contentHeight": 900,
              "printcontent": this.pickinglist[a].itemName,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 + 350 - 10 + singlealignnum,
              "y": h * a + 510 + 60 + 50,
              "printcontent": new Number(this.pickinglist[a].actualPrice).toFixed(2),
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 + 380 + 70 - 10,
              "y": h * a + 510 + 60 + 50,
              "printcontent": this.pickinglist[a].orderQty,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 + 380 + 70 + 70 - 10 + amountalignnum,
              "y": h * a + 510 + 60 + 50,
              "printcontent": singleAmount.toFixed(2),
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, )
            s = a;
          }



          let changecode
          let qrcode = 3
          if (this.orderFrom.substr(0, 1) == "天猫") {
            qrcode = 1
            changecode = 2
          } else if (this.orderFrom == "京东") {
            qrcode = 2
            changecode = 2
          } else if (this.orderFrom == "京东到家") {
            qrcode = 4
            changecode = 2
          } else if (this.orderFrom == "云店" || this.orderFrom == "云店2.0") {
            qrcode = 4
            changecode = 5

          } else if (this.orderFrom == "美团" || this.orderFrom == "饿了么") {
            changecode = 4
          } else if (this.orderFrom == "莴笋") {
            changecode = 3
          }

          msg.data.push({
            "printtype": 1,
            "x": 200,
            // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
            "y": (h * this.pickinglist.length) + 510 + 100 + 200 + 100,
            "printcontent": "尊敬的顾客，如您对订单有任何疑问",
            "fontSize": 2,
            "rotate": 0,
            "bold": 0,
            "reverse": false,
            "underline": false
          }, {

            "printtype": 1,
            "x": 75,
            // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
            "y": (h * this.pickinglist.length) + 510 + 100 + 200 + 150,
            "printcontent": `请联系在线客服或致电屈臣氏客服4008301310（移动电话拨打）转${changecode}`,
            "fontSize": 2,
            "rotate": 0,
            "bold": 0,
            "reverse": false,
            "underline": false
          }, )

          if (qrcode == 3) { //三个二维码
            msg.data.push({
                "printtype": 1,
                "x": 40,
                "y": h * this.pickinglist.length + 510 + 390 + 110,
                "contentWidth": 600,
                "contentHeight": 400,
                "printcontent": "下载屈臣氏APP",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 30,
                "y": h * this.pickinglist.length + 510 + 390 + 150,
                "contentWidth": 600,
                "contentHeight": 400,
                "printcontent": "全球美妆1小时闪送到家",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 60,
                "y": h * this.pickinglist.length + 510 + 390 + 150 + 60,
                "printcontent": "https://a.app.qq.com/o/simple.jsp?pkgname=com.watsons.mobile",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },

              {
                "printtype": 1,
                "x": 375,
                "y": h * this.pickinglist.length + 510 + 390 + 110,
                "printcontent": "满99减25",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 300,
                "y": h * this.pickinglist.length + 510 + 390 + 150,
                "printcontent": "扫码发关键字【优惠券】领取",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 350,
                "y": h * this.pickinglist.length + 510 + 390 + 150 + 60,
                "printcontent": "http://weixin.qq.com/q/029BuWYvgjbo_10000M07I",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },

              {
                "printtype": 1,
                "x": 640,
                "y": h * this.pickinglist.length + 510 + 390 + 110,
                "printcontent": "如需申请电子发票",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 640,
                "y": h * this.pickinglist.length + 510 + 390 + 150,
                "printcontent": "请扫下方二维码",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 640,
                "y": h * this.pickinglist.length + 510 + 390 + 150 + 60,
                "printcontent": "https://h5.watsons.com.cn/act/2018/1018_invoice/?f=CNDdeliveryreceipt-invoice20191230",
                "rotate": 0,
                "qrver": 1,
                "qrlel": 0,
              },
            )
          } else if (qrcode == 1) { //天猫cnc 天猫cnd
            msg.data.push({
                "printtype": 1,
                "x": 330,
                "y": h * this.pickinglist.length + 510 + 390 + 110,
                "printcontent": "扫码获取更多优惠资讯",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              }, {
                "printtype": 3,
                "x": 350,
                "y": h * this.pickinglist.length + 510 + 390 + 150,
                "printcontent": "https://m.tb.cn/Q.109c0",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },

            )
          } else if (qrcode == 2) { // 京东
            msg.data.push({
                "printtype": 3,
                "x": 350,
                "y": h * this.pickinglist.length + 510 + 390 + 150,
                "printcontent": "http://qr02.cn/EDsGVt",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },


            )
          } else if (qrcode == 4) { //两个二维码
            msg.data.push({
                "printtype": 1,
                "x": 150,
                "y": h * this.pickinglist.length + 50 + 510 + 390 + 100,
                "contentWidth": 600,
                "contentHeight": 400,
                "printcontent": "添加你的美丽顾问",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 120,
                "y": h * this.pickinglist.length + 50 + 510 + 390 + 150,
                "contentWidth": 600,
                "contentHeight": 400,
                "printcontent": "超新超火超值好物专属推荐",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 150,
                "y": h * this.pickinglist.length + 50 + 510 + 390 + 150 + 50,
                "printcontent": "http://weixin.qq.com/q/02zpFu4SqAb5T10000007i",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },



              {
                "printtype": 1,
                "x": 580,
                "y": h * this.pickinglist.length + 50 + 510 + 390 + 100,
                "printcontent": "屈臣氏会员",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 520,
                "y": h * this.pickinglist.length + 50 + 510 + 390 + 150,
                "printcontent": "超值权益，一年省超￥800",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 550,
                "y": h * this.pickinglist.length + 50 + 510 + 390 + 150 + 50,
                "printcontent": "http://weixin.qq.com/q/02J21S5AqAb5T10000M073",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },
            )

          }



          if (autoprint) {
            this.autoprint(msg, printstate)
          } else {
            // this.showprintTipBox(msg)
            console.log(msg)
            this.$bridge.callHandler('BlueprinterCall', msg, (res) => {

            })
          }
        }
      },
      autoprint(msg, printState) {
        let content = "小票"
        let that = this
        if (printState == 0) {
          content = "Header"
        }
        layer.open({
          title: '',
          className: 'pickingTips',
          content: '确定打印' + content + "?",
          skin: "demo-class",
          btn: ['确定', '不打印'],
          yes: (index) => {

            this.$bridge.callHandler('BlueprinterCall', msg, (res) => {

            })
            layer.close(index);
          },
          btn2: (index) => {
            layer.close(index);
          }
        });
        this.tipscss()
      },

      goBack() {
        //把每个拣货数，添加到每个item中
        let totalcount = 0
        let itemno
        this.pickinglist.forEach((iterator, k) => {
          this.$set(this.pickinglist[k], 'mulpickcount', this.goodsCount[k]);
          totalcount = totalcount + Number(iterator.mulpickcount)

        });
        this.$router.push({
          path: "MultipleChoiceArrPickingGoodsList",
          query: {
            totalcount: totalcount,
            pickinglist: this.pickinglist,
            fromdetail: true,
            allItemList: this.allItemList
          }
        })

      },
      unlockList: function (orderNo, lockId) {

        var url = this.$store.state.runurl + "/watsons/rest/gateway/kms/onstore/admin/common/order/unlockPick";
        var t = this.$store.state.token
        // var d  = {" orderNo ": "454515722619000003"}
        //             var f = new FormData();
        //             f.append("orderNo",orderNo)
        //             f.append("lockId",lockId)
        var data = {
          "orderNo": orderNo,
          "lockId": lockId,

        };
        $.ajax({
          type: 'post',
          data: data,
          url: url,
          datatype: "json",
          // processData: false,
          // contentType: false,
          headers: {
            "Token": this.$store.state.token,
            "content-type": 'application/x-www-form-urlencoded'

          }
        }).then((res) => {
          if (res != null && res != "" && res.code != null && res.code == "0") {
            // store.state.orderItem =   this.orderlist[i]
            // this.sendlockList(this.orderlist[i].orderNo,i)
            //  this.picking = res.data.orderItem.length
          } else if (res.code == 403) {
            var that = this
            layer.open({
              title: '',
              className: 'pickingTips',
              content: '登录已过期，现准备重新登录',
              skin: "demo-class",
              btn: ['好的'],
              yes: function (index) {
                // location.reload();
                Router.push("/")

                layer.close(index);
              }
            });

            that.tipscss()
          } else {
            layer.msg(res.msg);

          }
        }, function (res) {
          //失败之后处理逻辑
          //loadding取消
          //提示无数据
          layer.closeAll('loading')
          layer.msg('解锁订单失败，请联系管理员');

        })
      },
      backTopPage() {

      },
      inputfocus(i) {
        this.keyboardshow = false
        this.$set(this.goodsCount, i, "");

      },
      forId: function (index) {
        return "forid_" + index
      },

      goodsstateforId(index) {
        return "goodsstateforId" + index
      },

      toShortage() {
        this.$set(this.Shortage, "orderNo", this.orderNo)
        this.$set(this.Shortage, "orderDate", this.orderDate)
        this.$set(this.Shortage, "storeNo", this.$store.state.storeNum)

        this.$set(this.Shortage, "creater", this.$store.state.cempno)
        this.$set(this.Shortage, "orderChannel", this.$store.state.channelArr)
        this.$set(this.Shortage, "items", [])

        console.log(' this.orderNo', this.orderNo);

        // this.$set(this.Shortage,"orderNo", store.state.channelArr)
        // var  = []
        var equalQty = true

        var cangoshortage = false
        var enoughCount = false
        for (var i = 0; i < this.pickinglist.length; i++) {
          var orderQty = this.pickinglist[i].orderQty
          var addnum = this.goodsCount[i]
          var una = Number(orderQty) - Number(addnum)
          if (this.pickinglist[i].itemFlag != undefined && this.pickinglist[i].itemFlag != "" && this.pickinglist[i]
            .itemFlag != "D" && una != 0 &&
            this.pickinglist[i].reason != undefined && this.pickinglist[i].reason != "" && this.pickinglist[i]
            .reason !=
            null) {
            //需改成商品数 - 拣货数
            // let  orderQty  = this.pickinglist[i].orderQty
            // let addnum = this.goodsCount[i]
            //  let una  = Number(orderQty) - Number(addnum)
            this.$set(this.pickinglist[i], "addNum", una)
            this.$set(this.pickinglist[i], "itemCode", this.pickinglist[i].itemNo)

            var list = {
              "itemCode": this.pickinglist[i].itemCode,
              "itemName": this.pickinglist[i].itemName,
              "barcode": this.pickinglist[i].barcode,
              "orderNum": this.pickinglist[i].orderQty,
              "addNum": this.pickinglist[i].addNum,
              "reason": this.pickinglist[i].reason
            }

            //  if(list.reason==undefined||list.reason==""||list.reason==null){
            //   list.reason = "NA"
            //  }


            this.Shortage.items.push(list)
          }


          if (this.pickinglist[i].reason != undefined) {
            cangoshortage = true

          }



        }


        if (this.Shortage.items.length == 0) {
          layer.msg('操作有误，请检查缺货数量和原因');

        } else {
          var that = this
          for (var a = 0; a < this.changnnellist.length; a++) {

            if (this.$store.state.channelArr == this.changnnellistCN[a]) {
              this.$store.state.channelArr = this.changnnellist[a]
            }

          }

          layer.open({
            title: '',
            className: 'pickingTips',
            content: '确定做缺货记录？',
            skin: "demo-class",
            btn: ['确定', '取消'],
            yes: (index) => {
              // location.reload();
              // that.pickingPocket(that.orderItem.orderNo)
              this.mulpickcount()

              layer.close(index);
            }
          });
          this.tipscss()
          // layer.open({
          //   title: "缺货操作提示",
          //   className: 'pickingTips',
          //   type: 1,
          //   content: $('#unaTips'),
          //   skin: "demo-class",
          //   btn: ['确定', '取消'],
          //   yes: (index) => {
          //     this.mulpickcount()
          //     layer.close(index);
          //   },
          //   no: function (index) {
          //     layer.close(index);
          //   }
          // });

          this.tipscss()
          $(".layui-layer-btn0").css("background", "#FAE100")
          $(".layui-layer-btn0").css("color", "#000")
          $(".layui-layer-btn1").css("border", "none")
          $(".layui-layer-content").css("display", "flex")
          $(".layui-layer-content").css("justify-content", "left")
          $(".demo-class").css("width", "76%")
          $(".demo-class").css("left", "45px")
          $(".layui-input-block").css("display", "flex")
          $(".layui-input-block").css("margin-left", "0px")
        }


      },

      tipscss() {

        $(".layui-layer-btn1").css("border", "none")
        $(".layui-layer-btn0").css("border", "none")
        $(".layui-layer-btn0").css("border", "none")
        $(".layui-layer-btn0").css("background", "#009E96")
        $(".layui-layer-close2").css("display", "none")
        $(".layui-layer-title").css("display", "none")
        $(".layui-layer-content").css("display", "flex")
        $(".layui-layer-content").css("justify-content", "left")
        $(".layui-layer-setwin").css("display", "none")



      },

      unavailable(orderNo) { //缺货逻辑
        layer.load(2);

        var url = this.$store.state.runurl + "/onstore/admin/common/order"
        if (this.UnavailableItemState) {

          url += "/addUnavailableItem"
        } else {

          url += "/insertUnavailableItem"
        }
        var t = this.$store.state.token
        // var d  = {'orderNo':orderNo,'lockId':store.state.cempno}
        $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify(this.Shortage),
          headers: {
            "Token": t,
            'Content-Type': 'application/json'

          }
        }).then((res) => {
          layer.closeAll('loading')

          if (res.code == 0) {
            //提示
            var that = this
            let UnavailableItemMsg = this.UnavailableItemState === true ? "缺货订单提交完成" : "缺货登订单记完成"
            layer.msg(UnavailableItemMsg);

            this.readypicking = false
            // this.UnavailableState = true
            //如果提交过缺货，就把当前界面，用黄色提示条提示用户..
            if (this.UnavailableItemState) {
              this.$store.state.beforeOrderNum = orderNo //如果跳出页面，才记录，停在页面不记录当前订单号
              Router.push({
                name: 'AlreadyPickOrderList'
              })
            } else {
              that.UnavailableState = true

              for (let index = 0; index < that.Shortage.items.length; index++) {
                //对比itemlist与和goodsCount - shortitemlist  的数量是否一直才允许拣货
                for (let goodsindex = 0; goodsindex < that.pickinglist.length; goodsindex++) {
                  if (that.Shortage.items[index].itemCode == that.pickinglist[goodsindex].itemCode) {
                    var n = Number(that.pickinglist[goodsindex].orderQty) - Number(that.Shortage.items[index]
                      .addNum)
                    that.$set(that.pickinglist[goodsindex], "AfterShortageGoodsCount", n)
                    //  this.pickinglist[goodsindex].afterShortUnaCount
                  }
                }
              }
            }
          } else if (res.code == 403) {
            var that = this
            layer.open({
              title: '',
              className: 'pickingTips',
              content: '登录已过期，现准备重新登录',
              skin: "demo-class",
              btn: ['好的'],
              yes: function (index) {
                // location.reload();
                Router.push("/")

                layer.close(index);
              }
            });

            that.tipscss()
          } else {
            layer.msg('缺货报告失败，请重试');
          }

          // 提示用户已经拣货完毕，弹出对话框，然后后返回到上一页
        }, function (res) {
          //失败之后处理逻辑
          //loadding取消
          //提示无数据
          layer.closeAll('loading')
          layer.msg('缺货报告异常，请联系管理员');

        })
      },

      closeselecttips(i) {
        this.readypicking = true
        if (i != "a") {
          this.selectindex = i
        }

        this.showselectstate = !this.showselectstate
        if (this.showselectstate && this.pickinglist[i].reason) {
          let result = this.reasonarr.findIndex((value) => value == this.pickinglist[i].reason);
          if (result != -1) {
            $("#reasonid" + i).attr('class', 'on');

          }
        }
      },

      choicereason() {
        // 1.把当前选了reason的itemlist，加入reason，加入已拣数量，放进缺货list中
        // 2.
        //    
        this.closeselecttips('a')
        this.$set(this.pickinglist[this.selectindex], "reason", this.selectReasonoption)
        if (this.selectReasonoption == "1001") {
          this.$set(this.pickinglist[this.selectindex], "reasonText", "库存缺货")
          this.$set(this.pickinglist[this.selectindex], "reason", "1001")

        } else if (this.selectReasonoption == "1002") {
          this.$set(this.pickinglist[this.selectindex], "reasonText", "近效期或破损")
          this.$set(this.pickinglist[this.selectindex], "reason", "1002")


        }
        // var t = this.pickinglist[this.selectindex]

      },

      selectReason(i) {
        $("#reasonid" + i).attr('class', 'on');
        if (i > 1) {
          $("#reasonid" + 1).removeClass("on");
          // this.$set(this.shortpickreasontext,i,"近效期或破损")
        } else {
          $("#reasonid" + 2).removeClass("on");
          // this.$set(this.shortpickreasontext,i,"库存缺货")

        }

        i = i - 1
        console.log("reasonid=========" + i)
        this.selectReasonoption = this.reasonarr[i]


      },

      goodlist4show: function (index) {
        if (this.pickinglist[index].itemFlag == "D") {
          return false
        } else {
          return true
        }

      },

      getreasonid(i) {
        return "reasonid" + i
      },


      goodslist3: function (index) {

        return "goodslist3" + index
      },

      canshowCount: function () {
        for (var count = 0; count < this.pickinglist.length; count++) {
          if (this.pickinglist[count].itemFlag == "D") {
            //把免拣货的数量== 库存数量           例如 购物袋x200   邮费x1
            $("#goodslist3" + count).css("display", "none")
          }
        }
      },


      moudleismore: function (index) {
        // console.log("this.pickinglist[index].planogram_id============="+this.pickinglist[index].planogram_id)
        // return false
        if (this.planogramId != null && this.planogramId.length > 1) {

          return true
        } else {
          return false

        }
      },

      showcamerascan() {
        let msg = this.msg
        var phoneType = window.sessionStorage.phoneType
        if (phoneType == "android") {
          this.$bridge.callHandler('scanCodeCall', msg, (res) => {})
        } else {
          this.$bridge.callHandler('callScan', msg, (res) => {
            // 处理返回数据
          })
          // this.IOSgetScanCode()
        }

      },

      getAPPDate() {

        var that = this
        if (this.$store.state.phonetype == "ios") {

          this.$bridge.registerHandler('scanResult', (data, responseCallback) => {
            var result = false
            var count = 0
            let allok = false //检查是不是全部item都够数量
            for (var i = 0; i < this.pickinglist.length; i++) {
              if (this.pickinglist[i].store_barcode.indexOf(data) != -1 && this.goodsCount[i] < this.pickinglist[i]
                .orderQty) {
                result = true
                count = i
                i = this.pickinglist.length
                allok = false
              } else if (this.pickinglist[i].store_barcode.indexOf(data) != -1 && this.goodsCount[i] == this
                .pickinglist[i].orderQty) {
                allok = true
              }
            };

            if (result) {
              this.addCount(count)
            } else if (allok) {
              layer.msg('全部货物已够数量，请继续拣货流程');
            } else {
              layer.msg('货号不匹配，请重扫');
            }
            responseCallback(data)
          })

        }

        this.$bridge.registerHandler('scanCallback', (data, responseCallback) => {
          // alert('app主动调用js方法，传入数据:'+ data)

          var result = false
          var count = 0
          let allok = false //检查是不是全部item都够数量
          for (var i = 0; i < this.pickinglist.length; i++) {
            if (this.pickinglist[i].store_barcode.indexOf(data) != -1 && this.goodsCount[i] < this.pickinglist[i]
              .orderQty) {
              result = true
              count = i
              i = this.pickinglist.length
              allok = false
            } else if (this.pickinglist[i].store_barcode.indexOf(data) != -1 && this.goodsCount[i] == this
              .pickinglist[i].orderQty) {
              allok = true
            }
          };

          if (result) {
            this.addCount(count)
          } else if (allok) {
            layer.msg('全部货物已够数量，请继续拣货流程');
          } else {
            layer.msg('货号不匹配，请重扫');
          }
          responseCallback(data)
        })

        if (this.$store.state.phonetype == "urovo" || this.$store.state.phonetype == "TC51" || this.$store.state.phonetype == "UBX" ||
        this.$store.state.phonetype == "DT50") {


          this.$bridge.registerHandler('redScanCodeCall', (data, responseCallback) => {
            // alert('app主动调用js方法，传入数据:'+ data)

            var result = false
            var count = 0
            let allok = false //检查是不是全部item都够数量
            for (var i = 0; i < this.pickinglist.length; i++) {
              if (this.pickinglist[i].store_barcode.indexOf(data) != -1 && this.goodsCount[i] < this.pickinglist[i]
                .orderQty) {
                result = true
                count = i
                i = this.pickinglist.length
                allok = false
              } else if (this.pickinglist[i].store_barcode.indexOf(data) != -1 && this.goodsCount[i] == this
                .pickinglist[i].orderQty) {
                allok = true
              }
            };

            if (result) {
              this.addCount(count)
            } else if (allok) {
              layer.msg('全部货物已够数量，请继续拣货流程');
            } else {
              layer.msg('货号不匹配，请重扫');
            }
            responseCallback(data)
          })
        }
        // this.$bridge.registerHandler('BlueprinterCall', (data, responseCallback) => {
        //   // that.unlockList(this.orderNo, store.state.cempno)
        //   console.log("BlueprinterCall====================")
        // })

        this.$bridge.registerHandler('userGoBack', (data, responseCallback) => {
          that.unlockList(this.orderNo, store.state.cempno)
          console.log("CloseWebView====================")
        })
        // this.$bridge.registerHandler('userKeyBack', (data, responseCallback) => {
        //                 that.unlockList(this.orderNo,store.state.cempno)
        //                 console.log("userKeyBack====================")

        // })


      },
      sendMsg() {
        let msg = this.msg
        if (store.state.phoneType == "urovo" || store.state.phoneType == "TC51" || store.state.phoneType == "UBX" ||
          store.state.phonetype == "DT50") {


          this.$bridge.callHandler('redScanCodeCall', msg, (res) => {
            // alert('获取app响应数据:'+res)
            this.test = res
          })
        } else if (store.state.phoneType == undefined || store.state.phoneType == "") {
          this.$bridge.callHandler('redScanCodeCall', msg, (res) => {
            // alert('获取app响应数据:'+res)
            this.test = res
          })
        }
        this.$bridge.callHandler('userKeyBack', msg, (res) => {
          // alert('获取app响应数据:'+res)
          // this.test = res
        })

        this.$bridge.callHandler('BlueprinterCheck', msg, (res) => {


          // if (res == 1) {
          //   this.showprint(0,true)
          // }
        })



      },


      showgoodsmoudle: function (index, event) {

        var planogramIdtemp = ""
        if (this.planogramId[index].length >= 1) {
          for (var i = 0; i < this.planogramId[index].length; i++) {
            if (i == 0) {
              planogramIdtemp = this.planogramId[index][i]
            } else {

              planogramIdtemp = planogramIdtemp + "</br>" + this.planogramId[index][i]
            }
            // planogramIdtemp.push("</br>")
          }

        }
        // this.pickinglist[index].planogramId
        console.log("planogramIdtemp==========" + planogramIdtemp)
        // console.log("=========event.currentTarget.target.id+index;"+event.target.id+index)
        var tips = layer.tips(planogramIdtemp, "#" + event.target.id, {
          tips: [4, '#000'],
          time: 5000
        });
      },

      pickinginit: function () {
        //  this.pickinglist =  store.state.pickitemlist
        
        this.allItemList = this.$route.query.allItemList
        this.pickinglist = this.$route.query.pickitemlist
        console.log('pickinglist', this.pickinglist);

        var totalcount = 0
        if (this.orderItem.unavailable == "1") {
          this.UnavailableState = true
        }
        for (var i = 0; i < this.pickinglist.length; i++) {

          if (this.pickinglist[i].itemFlag == "D") {
            this.goodsstateText.push("")
          } else {
            if (this.pickinglist[i].reason != undefined && this.pickinglist[i].reason != "") {
              this.$set(this.pickinglist[i], "reasonText", this.pickinglist[i].reasonText)

            } else {
              this.$set(this.pickinglist[i], "reason", this.pickinglist[i].reason)
              this.$set(this.pickinglist[i], "reasonText", "缺货原因")

            }


          }
          if (this.pickinglist[i].afterQty != undefined && this.pickinglist[i].afterQty != "" && this.pickinglist[i]
            .afterQty > 0) {
            this.goodsstateText.push("完成")
            this.goodsstate.push(false)

            this.goodsCount.push(this.pickinglist[i].afterQty)
          } else if (this.pickinglist[i].reason != undefined && this.pickinglist[i].reason != "") {
            this.goodsstateText.push("完成")
            this.goodsstate.push(false)

            this.goodsCount.push(this.pickinglist[i].afterQty)
          } else {
            this.goodsCount.push(0)
            this.goodsstateText.push("待拣货")
            this.goodsstate.push(true)

          }
          this.goodstotalcount++
          var count = this.pickinglist[i].orderQty
          totalcount = Number(totalcount) + Number(count)

        }

        this.goodstotalcount = totalcount

      },





      toDetail: function () {
        Router.push({
          name: 'AlreadyPickOrderList'
        })

      },
      resetbackground: function () {

        var h = $(window).height()
        var orderlistheight = $(".orderlistContent").height()
        var topheight = $(".title").height()
        var DetailsTitle = $("#DetailsTitle").height()


        // h = h*2.2
       let boxheight = this.pickinglist.length * orderlistheight
        $(".thirdBox").css("height", boxheight)
        $("#third").css("height", h)

        //        $(".index").css("height",h*0.7)
      },
      mulpickcount() {
        //把每个拣货数，添加到每个item中
        let totalcount = 0
        let itemno
        this.pickinglist.forEach((iterator, k) => {
          this.$set(this.pickinglist[k], 'mulpickcount', this.goodsCount[k]);
          totalcount = totalcount + Number(iterator.mulpickcount)

        });
        this.$router.push({
          path: "MultipleChoiceArrPickingGoodsList",
          query: {
            totalcount: totalcount,
            pickinglist: this.pickinglist,
            fromdetail: true,
            allItemList: this.allItemList
          }
        })
      },
      gopicking() {
        var b
        if (this.UnavailableState) {

          for (var a = 0; a < this.pickinglist.length; a++) {

            // 如果有缺货登记的情况，先把缺货登记的数量显示出来


            if (this.pickinglist[a].AfterShortageGoodsCount != undefined && this.goodsCount[a] != this.pickinglist[
                a]
              .AfterShortageGoodsCount && this.pickinglist[a].itemFlag != "D") {
              layer.msg("数量有误，请重新检查")
              return
            } else if (this.pickinglist[a].AfterShortageGoodsCount == undefined && this.pickinglist[a].orderQty !=
              this
              .goodsCount[a] && this.pickinglist[a].itemFlag != "D") {
              layer.msg("数量有误，请重新检查")
              return
            } else {
              b = true

            }
          }
        } else {

          for (var a = 0; a < this.pickinglist.length; a++) {

            // 如果有缺货登记的情况，先把缺货登记的数量显示出来


            if (this.pickinglist[a].orderQty != this.goodsCount[a] && this.pickinglist[a].itemFlag != "D") {
              layer.msg("数量有误，请重新检查")
              return
            } else {
              b = true

            }
          }
        }
        if (b) {
          // layer.msg("准备拣货")
          layer.open({
            title: '',
            className: 'pickingTips',
            content: '确认完成当前货物分拣？',
            skin: "demo-class",
            btn: ['确定', '取消'],
            yes: (index) => {
              // this.pickingPocket(this.orderItem.orderNo)
              this.mulpickcount()
              layer.close(index);
            }
          });
          this.tipscss()

        }

      },

      onbl: function (index) {
        this.readypicking = true
        this.keyboardshow = true
        var havereason = false
        var c = this.goodsCount[index]
        for (var a = 0; a < this.pickinglist.length; a++) {
          if (this.pickinglist[a].reason != undefined == this.pickinglist[a].reason == null) {
            havereason = true
          } else {
            havereason = false
          }
        }
        if (this.UnavailableState) {
          // if(true){

          if (this.pickinglist[index].AfterShortageGoodsCount != undefined && this.pickinglist[index]
            .AfterShortageGoodsCount == c && !havereason) {
            //颜色变绿色
            //标识完成
            this.$set(this.goodsstateText, index, "完成");
            this.$set(this.goodsstate, index, false);
            this.topicking()
          } else if (this.pickinglist[index].AfterShortageGoodsCount != undefined && this.pickinglist[index]
            .AfterShortageGoodsCount < c || this.goodsCount[index] == "") {
            this.$set(this.goodsCount, index, 0);

            layer.msg("数量有误，请重新输入")
          }
        } else {

          if (this.pickinglist[index].orderQty == c && !havereason) {
            //颜色变绿色
            //标识完成
            this.$set(this.goodsstateText, index, "完成");
            this.$set(this.goodsstate, index, false);
            this.topicking()
          } else if (this.pickinglist[index].orderQty < c || this.goodsCount[index] == "") {
            this.$set(this.goodsCount, index, 0);

            layer.msg("数量有误，请重新输入")
          }
        }

      },

      topicking() {
        var topicking = false
        // console.log("c======"+c)
        // this.$set(this.goodsCount, index, c--);
        if (this.UnavailableState) {
          // if(true){
          for (var i = 0; i < this.goodsCount.length; i++) {
            if (this.pickinglist[i].AfterShortageGoodsCount == undefined && this.pickinglist[i].itemFlag == "D" ||
              this
              .goodsCount[i] == this.pickinglist[i].orderQty) {

            } else if (this.pickinglist[i].AfterShortageGoodsCount != undefined && this.pickinglist[i].itemFlag ==
              "D" || this.goodsCount[i] == this.pickinglist[i].AfterShortageGoodsCount) {
              topicking = true
            } else {
              topicking = false
              i = this.goodsCount.length + 1
            }
          }
        } else {


          for (var i = 0; i < this.goodsCount.length; i++) {
            if (this.pickinglist[i].itemFlag == "D" || this.goodsCount[i] == this.pickinglist[i].orderQty) {
              topicking = true
            } else {
              topicking = false
              i = this.goodsCount.length + 1
            }
          }
        }
        if (topicking) {
          var that = this
          layer.open({
            title: '',
            className: 'pickingTips',
            content: '您确定要分拣货？',
            skin: "demo-class",
            btn: ['确定', '取消'],
            yes: (index) => {
              // location.reload();
              // that.pickingPocket(that.orderItem.orderNo)
              this.mulpickcount()

              layer.close(index);
            }
          });
          that.tipscss()

        }
      },


      addCount: function (count) {
        this.readypicking = true
        // this.$set(this.starArr, index, score);
        if (this.pickinglist[count].itemFlag != "D") {
          var c = this.goodsCount[count]
          var picktatal = 0
          var addordertotalcount = 0
          var cangopicking = false
          if (this.UnavailableState) {
            // if(true){

            if (this.pickinglist[count].AfterShortageGoodsCount == undefined && this.pickinglist[count].orderQty ==
              c) {


              layer.msg('货品已拣够数量');
            } else if (this.pickinglist[count].AfterShortageGoodsCount != undefined && this.pickinglist[count]
              .AfterShortageGoodsCount == c) {
              layer.msg('货品已拣够数量');
            } else {

              console.log("=========goodsCount===============" + c)
              c++
              this.$set(this.goodsCount, count, c);
              if (c > this.pickinglist[count].orderQty) {
                layer.msg('货品已拣够数量');
              }
              if (this.pickinglist[count].orderQty == c) {
                //颜色变绿色
                //标识完成
                this.$set(this.goodsstateText, count, "完成");
                this.$set(this.goodsstate, count, false);
              }
              console.log("picktatal============" + picktatal)

              this.topicking()

            }
          } else {
            if (this.pickinglist[count].orderQty == c) {


              layer.msg('货品已拣够数量');
            } else {
              console.log("=========goodsCount===============" + c)
              c++
              this.$set(this.goodsCount, count, c);
              if (c > this.pickinglist[count].orderQty) {
                layer.msg('货品已拣够数量');
              }
              if (this.pickinglist[count].orderQty == c) {
                //颜色变绿色
                //标识完成
                this.$set(this.goodsstateText, count, "完成");
                this.$set(this.goodsstate, count, false);
              }
              console.log("picktatal============" + picktatal)

              this.topicking()

            }
          }

        }

      },

      goDown() {
        console.log("==========leave===")
      },

      init() {
        if (store.state.phonetype == undefined || store.state.phonetype == "" || store.state.phonetype == null ||
          store
          .state.phonetype == "urovo" || store.state.phonetype == "TC51" || store.state.phonetype == "UBX" || store
          .state.phonetype == "DT50") {
          this.showCamera = false
        }
        // },

      },

      cutCount: function (count) {
        var c = this.goodsCount[count]
        console.log("=========goodsCount===============" + c)
        if (c > 0)
          this.$set(this.goodsCount, count, c - 1);
        this.$set(this.goodsstate, count, true);
        this.$set(this.goodsstateText, count, "待拣货");

      },

    },
    beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      if (this.tolistpage) {

        to.meta.keepAlive = true; // 让 A 缓存，即不刷新
      }
      next();
    },


    mounted() {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        // window.addEventListener('popstate', this.goBack, false);
      }


      this.resetbackground()
      this.pickinginit();
      this.getAPPDate();
      this.sendMsg()
      this.canshowCount();
      this.init()

    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .thirdBox {
    background: #f2f2f2;
    padding-top: 3.8rem;
  }

  .orderlistContent {
    padding-bottom: 0.7rem;
    border-bottom: 1px solid #EFEFF4;
  }

  .closeImg {
    display: block;
    width: 1rem;
    transform: rotate(-90deg);
  }

  .closeselect {
    display: inline-block;
    margin-top: 0.2rem;
    float: right;
    width: 1.7rem;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }

  .pocketID {
    padding-left: 1rem;
  }

  .searchFixedList {
    background: #fff;
    padding-left: 1rem;
  }

  .goodsmoudle {
    width: 45%;
    font-size: 0.8rem !important;
    color: #8d8d8d !important
  }

  .unaTips {
    display: none;
    width: 100%;
    margin: auto;
    padding-left: 1rem;
  }

  .tipsBox {
    display: flex;
    margin-bottom: 1rem;


  }

  .tipsBoxContent {
    margin-bottom: 1.1rem;
    margin-top: 1rem;
  }

  .underline {
    width: 100%;
    height: 1px;
    background: #e2e2e2;
  }

  .PocketNum {
    width: 80%;
    margin: .5rem auto;
    height: 1.5rem;
    background: #F2F2F2;
    border-radius: 0.3rem;
    border: none;
    display: block;
  }

  .orderName {
    display: inline-block;
    width: 70%;
    /* height: 6rem; */
    color: #9d9d9d;
    font-size: 0.8rem;
    overflow: hidden;
    /* text-overflow: ellipsis; */
    /* white-space: nowrap; */
    word-break: break-word;
    /* word-break: break-all; */
  }

  .goodsprice {
    float: right;
    color: #9d9d9d;
    padding-right: 1rem;
  }

  .thirdTitle {
    float: left;
    font-size: 1.7rem;
    margin-bottom: 0.3rem;

  }

  #third {
    background: #fff;
    overflow: auto;
    padding-bottom: 7rem;
    width: 95%;
    margin: auto;
  }

  .goodslist1 div {
    display: inline-block;

  }

  .list1 {
    margin-bottom: 0.5rem;
    padding-top: 0.5rem;
    padding: 1rem;
  }

  .quantity {
    position: relative;
    left: 3.2rem;
    font-size: 0.7rem;
    color: #9d9d9d;
    padding-right: 1rem;
  }

  .goodlist4 img {
    float: right;
    margin-top: 0.4rem;
  }

  .cameraIcon {
    float: right;
    padding-right: 1rem;
    padding-top: 0.9rem;
    width: 1.3rem;
  }

  .quantityCount {
    font-size: 0.9rem;
    text-decoration: line-through;
  }

  quantityCountAfter {
    font-size: 0.9rem;
    text-decoration: line-through;
  }

  .shortcount {
    color: #42b983
  }

  .goodsordernum,
  .goodsmoudle {
    font-weight: 600;

  }

  .goodsordernum {

    width: 25%;
  }

  .layui-input-block {
    display: flex;
  }

  .ordernum {
    float: left;
    padding-left: 1rem;
    font-size: 1.2rem;
  }

  .price {
    padding-right: .5rem;
    float: right;
  }

  .count {
    width: 3rem;
    border: none;
    margin: 0 0.2rem;
    text-align: center;
  }

  .channelText {
    color: #FFBD2F;
    margin-left: 1rem;
    padding: 0.1rem 0.3rem;
    margin-bottom: .5rem;
    border-radius: 0.2rem;
    margin-right: 1rem;
    border: 1px solid;
    font-size: 0.6rem !important;
  }

  .orderDate {
    /* float: right; */
    width: 53%;
    color: #9d9d9d;
  }

  #pickbutton {
    background: #42b983;
    color: #fff;
  }

  .list2 {
    font-size: 0.8rem;
  }


  .orderlist {
    height: 2rem;
    line-height: 2rem;
  }


  .totalcount {}

  .titlename {
    font-weight: 600;
    width: 50%;
    height: 2rem;
    line-height: 3rem;
    margin: auto;
    display: inline-block;
  }

  .description {
    right: 1rem;
    top: 1rem;
    font-size: 0.9rem;
    position: relative;
    color: #9d9d9d;
    float: right;
  }

  .point {
    width: 1rem;
    padding-left: 0.3rem;
    padding-top: 0.9rem;
  }

  .top {
    position: fixed;
    width: 100%;
    top: 0;
    background: #EFEFF4;
    z-index: 99;
    border-bottom: 1px solid #f2f2f2;
  }

  .unaorder {
    width: 5rem;
    height: 2rem;
    margin-right: 1rem;
    display: inline-block;
    background: #FAE100;
    color: #000;
    text-align: center;
    line-height: 2rem;
  }

  .unacheck {
    display: inline-block;
    width: 5rem;
    margin-right: 1rem;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    background: #f4f4f4;
    color: #707070;
  }

  .tipsBoxTitle {
    font-weight: 600;
    height: 4rem;
    line-height: 3rem;
  }

  .goodlist4point {
    width: .4rem;
    display: inline-block;
    transform: rotate(-90deg)
  }

  .list {
    margin-top: 2rem;
    padding-bottom: 1rem;
  }

  .ClickIcon {
    float: left;
    width: 2.8rem;
    margin-right: 1rem;
  }

  .pickinggoodsstate {
    border: none;
    float: right;
    width: 12%;
    padding-right: 1rem;
    padding-top: 0.5rem;
    text-align: right;
    color: #FFBD2F;
    font-size: 0.8rem;
  }

  .okgoodsstate {
    border: none;
    float: right;
    width: 11%;
    padding-right: 1rem;
    padding-top: 0.5rem;
    text-align: right;
    color: #4ACC6B;
  }

  .ButtonGroup {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  #secondTitle {
    margin: 0.5rem 0;
  }

  .searchKey {
    margin-top: 1rem;
  }

  .goodlist4 {
    position: relative;
    display: inline-block;
    left: 1.5rem;
    width: 7.5rem;
    font-size: 0.6rem;
    background: #F7F7F7;
    height: 1.3rem;
    line-height: 1.3rem;
    color: #9d9d9d;
    padding: 0 0.5rem;
  }

  .counts,
  #countTips {
    color: red;
  }

  #count {
    width: 100%;
    text-align: center;
    margin: auto;
    background: #EBF5FD;
    border-radius: 1rem;
    padding: 1rem 0;
    color: #9d9d9d;
  }

  .searchlistButton {
    border: none;
    float: right;
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    background: #9d9d;
    color: #fff;
    text-align: center;
    margin-top: 1rem;
    margin-right: 1rem;

  }

  .list3 div {

    display: inline-block
  }

  .list3 {
    color: #9d9d9d;
    padding-left: 0.8rem;

  }

  .goodsNum {
    width: 30%
  }

  .goodstype {
    width: 20%;
    color: #37ACD5;
  }

  .checkstate {
    color: #FFBD2F;
    font-size: 0.9rem;
  }

  .bookingTime {
    width: 79%;
    color: #3193F7;
    font-size: 0.8rem;
  }

  .searchlistcheckBox {
    padding: 0.4rem;
    font-size: 0.9rem;
    border-bottom: 1px solid #f2f2f2;
  }


  .listcontent {
    border-bottom: 1px solid;
    width: 85%;
    height: 3.4rem;
    margin-left: 4rem;
  }

  #one,
  #two,
  #three {
    display: inline-block;
    width: 32%;
    box-sizing: border-box;
  }

  #first {
    font-size: 0.9rem;
    height: 3rem;
  }

  .totalprice {
    font-weight: 600;
  }

  .placeIcon {
    float: left;
    width: 1.5rem;
  }

  #countTips {
    height: 3rem;
    line-height: 4rem;
  }

  .goodsTipsButton {
    /* display: inline-block; */
    float: left;
    width: 50%;
    height: 3rem;
    box-sizing: border-box;
    line-height: 3rem;
    background: #FAE100;
    color: #000;
    text-align: center;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  #DetailsTitle {
    width: 88%;
    margin: 1rem auto;
    border-radius: 0.6rem;
    background: #fff;
    height: 7rem;
    padding: 0 1rem;
  }

  .title {
    height: 3rem;
    line-height: 1.9rem;
    text-align: center;
    background: #fff
  }

  .four {
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    background: #FAE100;
    font-size: 0.9rem;
    color: #2c3e50;
  }

  .backPoint {
    width: 4.5%;
    padding-top: 1.1rem;
    padding-left: 1rem;
    float: left;
  }

  .scanCount {
    font-size: 0.9rem;
    color: #9d9d9d;
  }

  .searchInput {
    border: none;
    background: #F2F2F2;
    height: 2rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    width: 78%;
  }

  .codeIcon {
    width: 1rem;
    position: relative;
    right: 2rem;
    top: 0.2rem;

  }

  #channel {
    padding-bottom: 1rem;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 1rem;
  }

  .goodslist1,
  .goodslist2,
  .goodslist3 {
    padding-left: 1rem;
    /* height: 1.7rem; */
    line-height: 1.7rem;

  }

  .goodsordernum,
  .goodsmoudle {

    font-size: 0.9rem;
  }

  .add {
    width: 1rem;
  }

  .cut {
    margin-left: 1rem;
    width: 1rem;
  }

  .Button {
    /* margin-top: 1rem;
    margin-bottom: 1rem; */
  }

  .searchButton {
    color: #9d9d9d;
    float: right;
    font-size: 0.9rem;
    width: 10%;
    padding-top: 0.4rem;
    padding-right: 0.6rem;
  }

  .PocketDiv {
    background: #fff;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;

  }

  #closePocketDiv {
    width: 100%;
    height: 3rem;
    line-height: 3.7rem;
    border-top: 1px solid #F2F2F2;
    text-align: center;
  }

  .PocketTitle {
    height: 2.5rem;
    line-height: 2.5rem;
    margin: auto;
  }

  /*弹框*/
  .maskBoxblack {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.65);
    line-height: 100%;
    z-index: 99999;
    /* text-align: center; */
  }



  .index {
    background: #EFEFF4;
  }

  .clearfix:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    /* 触发 hasLayout */
    zoom: 1;
  }

  /* 选项提示 */
  .spec-menu {
    display: block;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 200;
  }

  .paramidBox {
    /* display: flex;
    justify-content: space-between; */
  }

  .moreplanogram {
    display: none;
  }

  .spec-menu .spec-menu-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 52%;
    background-color: #fff;
    border-top: 1px solid #dadada;
    z-index: 250;
  }

  .spec-menu .spec-menu-up {
    width: 100%;
    height: 84px;
    position: relative;
    border-bottom: 1px solid #ededed;
  }

  .spec-menu .spec-menu-middle {
    position: absolute;
    bottom: 43px;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 10px;
    overflow: auto;
  }


  .spec-menu .spec-menu-middle .prod-spec {
    height: auto;
    padding-top: 12px;
    padding-bottom: 15px;
  }

  .spec-menu .spec-menu-middle .nature-box .pro-att {
    margin-bottom: 13px;
    overflow: hidden;
    position: relative;
  }

  .spec-menu .spec-menu-middle .spec-tit {
    display: inline-block;
    line-height: 2rem;
    font-size: 1rem;
    color: #999;
    height: 2rem;
    /* float: left; */
    margin-top: 3px;
  }

  .spec-menu .spec-menu-middle .nature-box .pro-att p .on {
    border: 1px solid #009E96;
    color: #009E96;
  }

  .spec-menu .spec-menu-middle .nature-box .pro-att p span {
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 3px;
    line-height: 40px;
    font-size: 12px;
    float: left;
    margin-right: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
    margin-top: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 69px;
    width: 47%;
    max-width: 98%;
    box-sizing: border-box;
    text-align: center;
  }

  .spec-menu .spec-menu-btn {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .spec-menu .spec-menu-btn .confirmSelect {
    background-color: #009E96;
  }

  .spec-menu .spec-menu-btn span {
    display: block;
    height: 44px;
    width: 100%;
    font-size: 14px;
    line-height: 44px;
    color: #fff;
    text-align: center;
    float: left;
  }

</style>
