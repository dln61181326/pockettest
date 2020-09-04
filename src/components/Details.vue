<template>

  <div class="index">

    <div class="layui-form-item unaTips" id="unaTips">
      <div class="tipsBoxTitle">
        缺货申请提示
      </div>
      <div class="tipsBox">

        <div class="layui-input-block">
          <div v-bind:class="[UnavailableItemState ? unacheck : unaorder ]" @click="UnavailableItemState = false">缺货登记
          </div>
          <div v-bind:class="[UnavailableItemState ? unaorder : unacheck ]" @click="UnavailableItemState = true">订单缺货
          </div>

        </div>
      </div>
      <div class="underline"></div>
      <div class="tipsBoxContent">确定要提交缺货申请？</div>
    </div>

    <div class="layui-form-item unaTips" id="TicketTips">
      <div class="tipsBoxTitle">
        打印小票选择
      </div>
      <div class="tipsBox">

        <div class="layui-input-block">
          <div v-bind:class="[PrintType ? unacheck : unaorder ]" @click="PrintType = false">Header
          </div>
          <div v-bind:class="[PrintType ? unaorder : unacheck ]" @click="PrintType = true">明细
          </div>

        </div>
      </div>
      <div class="underline"></div>
      <div class="tipsBoxContent">确定要打印？</div>
    </div>

    <nav class="navbar navbar-inverse navbar-fixed-top title">
      <img class="backPoint clearfix:after" src="../assets/backPoint.png" @click="goBack()">

      <div id="title" class="titlename">拣货</div>
      <img class="cameraIcon" @click="showcamerascan()" v-if="showCamera" src="../assets/cameraIcon.png">
      <img class="cameraIcon" @click="showprintTipBox()" v-if="canprintType" src="../assets/printer.png">


      <div class="clearfix"></div>
    </nav>

    <div class="four" v-if="UnavailableState">
      已提交缺货报告
    </div>
    <div class="four" v-if="changeOrderState"">

      {{topTips}}
    </div>

    <div id="DetailsTitle" class="navbar navbar-inverse navbar-fixed-top ">
      <div class="orderlist">
        <div class="orderlistContent">
          <div class="list1">
            <div class="ordernum clearfix:after">{{orderNo}}</div>

            <div class="totalprice clearfix:after">￥{{orderAmt}}</div>

            <div class="clearfix"></div>
          </div>
          <div class="list2">
            <div class="channelText">
              {{orderFrom}}
            </div>
            <div class="orderDate">{{expectedDeliveryTime}}</div>
            <div class="price">共 <span class="totalcount">{{goodstotalcount}}</span> 件商品</div>
          </div>

          <div class="list3">
            <div class="bookingTime">预约取货时间：{{orderDate}}</div>
            <div id="checkstate" class="checkstate">{{checkstate}}</div>
          </div>

        </div>

      </div>
    </div>


    <div id="third">
      <div class="orderlist">
        <!--  v-for="(dataList,index) in orderItem" -->
        <!-- @click="showScanPocketstate=!showScanPocketstate" -->
        <div class="orderlistContent" v-for="(dataList,index) in pickinglist">
          <div class="goodslist1">
            <div class="goodsordernum">{{dataList.itemNo}}</div>
            <div class="goodsmoudle" @click="showparammap(dataList.planogram_id)">{{dataList.planogram_id}}</div>
            <!-- v-if="moudleismore(index)" -->
            <span :id="forId(index)" class="moreplanogram" @click="showgoodsmoudle(index,$event)">...</span>
            <!-- v-bind:class="[starArr[index]==5 ? choosestar : nochoosestar]" -->
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
              <img class="goodlist4point " src="../assets/backPoint.png">
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

      <div id="pickbutton" v-bind:class="[notAllPicking ? notalldisplay : notallundisplay ]" class="goodsTipsButton clearfix:after" v-if="keyboardshow" @click="gopicking(true)">拣货</div>
      <div id="nopickbutton" class="goodsTipsButton clearfix:after" v-if="keyboardshow&&notAllPicking" @click="toShortage()">缺货</div>
      <div class="clearfix"></div>

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
            <img class="closeImg " src="../assets/backPoint.png">
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
              <img class="closeselect " src="../assets/close.png" @click="closeselecttips('a')">

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
  import Router from "../router/index";
  import store from '../vuex/store';
  import axios from 'axios';

  export default {
    data() {
      return {
        showselectstate: false,
        goodsCount: [],
        topTips:"当前单为变更单，请注意！",
        changeOrderState:false,
        canprintType: false,
        UnavailableItemState: false,
        PrintType: true, //选择 Header or Detail
        changnnellist: [],
        changnnellistCN: [],
        readypicking: false,
        keyboardshow: true,
        planogram: [],
        picklistitem: [],
        printBox: false,
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
        reasonarr: [],
        showScanPocketstate: false,
        orderItem: store.state.orderItem,
        pickinglist: store.state.orderItem.orderItem,
        unaorder: "unaorder",
        unacheck: "unacheck",
        UnavailableState: false,
        quantityCount: "quantityCount",
        quantityCountAfter: "quantityCountAfter",
        notAllPicking:true,
        notalldisplay :'notalldisplay',
         notallundisplay:'notallundisplay',
         mapstate:false,
          mapurl:""
      }
    },

    methods: {
      showparammap(planogram_id) {
        if(!this.mapstate){
          return
        }
        let paramNo = planogram_id.substr(0, 8)
        console.log('paramNo', paramNo);

        layer.open({
          type: 2,
          title: '陈列图',
          shadeClose: true,
          shade: 0.8,
          area: ['380px', '90%'],
          content: `${this.mapurl}?store=${this.$store.state.storeNum}&pog_code=${paramNo}` //iframe的url
        });
      },
      callprintLog() {
        // onstore/admin/kms/orderLog/addLog
        let u = `${store.state.runurl}/onstore/admin/kms/orderLog/addLog`;
        let param = {
          "action": "print",
          "orderLog": {
            "orderNo": this.orderNo,
            "optMethod": " KmsOrderLogController.addLog",
            "optName": store.state.cempno
          }
        }
        let head = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        axios.post(u, param, head).then(
          res => {
            console.log("printlog", res)
            if (res.data.code != 0) {
            }
          },
          function (res) {
          }
        );
      },
      changeStr(str, index, changeStr) {
        return str.substr(0, index) + changeStr + str.substr(index + changeStr.length);
      },

      showprintTipBox() {
        layer.open({
          title: "打印小票操作提示",
          className: 'pickingTips',
          type: 1,
          content: $('#TicketTips'),
          skin: "demo-class",
          btn: ['确定', '不打印'],
          yes: (index) => {
            console.log("this.printState===",this.PrintType)

            if (this.PrintType) {
              this.showprint(1, false)
            } else {
              this.showprint(0, false)

            }
            layer.close(index);
          },
          no: function (index) {
            layer.close(index);
          }
        });

        this.tipscss()
        $(".layui-layer-btn0").css("background", "#FAE100")
        $(".layui-layer-btn0").css("color", "#000")
        $(".layui-layer-btn1").css("border", "none")
        $(".layui-layer-content").css("display", "flex")
        $(".layui-layer-content").css("justify-content", "center")
        $(".demo-class").css("width", "76%")
        $(".demo-class").css("left", "45px")
        $(".layui-input-block").css("display", "flex")
        $(".layui-input-block").css("margin-left", "0px")
      },
      showprint(printstate, autoprint) {
        let takecode=this.orderItem.orderNo.substr(this.orderItem.orderNo.length-4)
      
        let msg
        let phone = this.orderItem.shipMobile
        let distributor = this.orderFrom == 'IST' ? '调拨单':this.orderItem.orderType == 'CNC' ? '门店速提' : this.orderItem.orderType == 'CND' ? '闪电送' : '同城配'
        distributor = `屈臣氏${distributor}订单`
        if(this.orderItem.allowOutStockPick&&this.orderFrom != 'IST'){
          distributor = ""
        }
        let length = this.orderItem.shipName.length
        let shipName = this.orderItem.shipName
        phone = this.changeStr(phone, 3, "****")
        let i = 0
        shipName =  shipName.substr(0,1)
        while(i<length){
         shipName +="*"
          i++
        }
        if (printstate == 0) { //header

          msg = {
            "pagewidth": 900,
            "pageheight": 500,
            "data": [
              
              {
                "printtype": 1,
                "x": 380,
                "y": 148,
                "printcontent": "取货码",
                "fontSize": 2,
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
                "printcontent": shipName,
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
                "x": 200,
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
                "printcontent": store.state.storeNum,
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
                "x": 520,
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
                "x": 640,
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
                "x": 520,
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
                "x": 640,
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

          if(this.orderItem.allowOutStockPick&&this.orderFrom != 'IST'){
            msg.data.push( 
              {
                "printtype": 1,
                "x": 520,
                "y": 118,
                "printcontent": takecode,
                "fontSize": 6,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 520,
                "y": 338,
                "printcontent": "骑手核销码",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              
              {
                "printtype": 1,
                "x": 670,
                "y": 338,
                "printcontent": this.orderItem.gotCode,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 2,
                "x": 50,
                "y": 0,
                "printcontent": "tmall.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
              
              )
          }else{
            msg.data.push(
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
                "printtype": 1,
                "x": 550,
                "y": 60,
                "printcontent": distributor,
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 2,
                "x": 0,
                "y": 28,
                "printcontent": "watsonslogo.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
              {
                "printtype": 2,
                "x": 300,
                "y": 28,
                "printcontent": "noreason.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
            )
          }
        } else {
          let itemheight = 120;
          let h = 75;
          let orderAmt = new Number(this.orderAmt)
          //判断是3种配送方的哪种  门店速提  闪电送  同城配
          msg = {
            "pagewidth": 1000,
            "pageheight": 1300 + 120 * this.pickinglist.length,

            "data": [
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
                "x": 370,
                "y": 148,
                "printcontent": "取货码",
                "fontSize": 2,
              },
              {
                "printtype": 1,
                "x": 450,
                "y": 118,
                "printcontent": this.orderItem.allowOutStockPick? takecode:this.orderItem.gotCode,
                "fontSize": 6,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 300,
                "y": 205,
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
                "printcontent": store.state.storeNum,
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
                "printcontent": shipName,
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
                "printcontent": this.orderItem.allowOutStockPick?"":"单价",
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
                "printcontent": this.orderItem.allowOutStockPick?"":"金额",
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
                "printcontent": this.orderItem.allowOutStockPick? "":"共计",
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
                "printcontent":this.orderItem.allowOutStockPick? "":orderAmt.toFixed(2),
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

          if(this.orderItem.version>0){
            msg.data.push( {
                "printtype": 1,
                "x": 250,
                "y": 260,
                "printcontent": "(变更单！请重新核对商品清单)",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },)
          }

          if(this.orderItem.allowOutStockPick&&this.orderFrom!="IST"){
            msg.data.push( {
                "printtype": 1,
                "x": 430,
                "y": 460,
                "printcontent": "骑手核销码:",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 630,
                "y": 460,
                "printcontent": this.orderItem.gotCode,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 2,
                "x": 50,
                "y": 0,
                "printcontent": "tmall.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
              {
                "printtype": 1,
                "x": 580,
                "y": 58,
                "printcontent": distributor,
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              )
          }else{
            msg.data.push(
              {
                "printtype": 2,
                "x": 0,
                "y": 28,
                "printcontent": "watsonslogo.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
              {
                "printtype": 2,
                "x": 300,
                "y": 28,
                "printcontent": "noreason.png",
                "bmpSizeX": 0,
                "bmpSizeY": 0,
              },
            )
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
              "contentWidth": 280,
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
              "printcontent": this.orderItem.allowOutStockPick?"": new Number(this.pickinglist[a].actualPrice).toFixed(2),
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 + 380 + 70 - 10,
              "y": h * a + 510 + 60 + 50,
              "printcontent": this.pickinglist[a].orderQty= this.pickinglist[a].pickupQty>=0? this.pickinglist[a].pickupQty :this.pickinglist[a].orderQty,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 + 380 + 70 + 70 - 10 + amountalignnum,
              "y": h * a + 510 + 60 + 50,
              "printcontent": this.orderItem.allowOutStockPick?"":singleAmount.toFixed(2),
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, )
            s = a;
          }



          let changecode = 3
          let qrcode = 3
          if (this.orderFrom.startsWith("天猫超市")) {
            qrcode = 6
            changecode = 6

          }else if (this.orderFrom.startsWith("IST")) {
            qrcode = 7
            changecode = 7

          } else if (this.orderFrom == "京东") {
            qrcode = 2
            changecode = 2
          } else if (this.orderFrom == "京东到家") {
            qrcode = 5
            changecode = 2
          } else if (this.orderFrom.startsWith("云店")) {
            qrcode = 4
            changecode = 5

          } else if (this.orderFrom == "美团" || this.orderFrom == "饿了么") {
            changecode = 4
          } else if (this.orderFrom.startsWith("莴笋") || this.orderFrom.startsWith("试用瓶")) {
            changecode = 3
          }else if (this.orderFrom.startsWith("天猫") ) {
            qrcode = 1
            changecode = 2
          }
          if(changecode==7){

          }else if(changecode!=6){
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
          }else{
            msg.data.push({
            "printtype": 1,
            "x": 200,
            // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
            "y": (h * this.pickinglist.length) + 510 + 100 + 200 + 100,
            "printcontent": "非常感谢您选择闪电送服务，欢迎您再次光临！",
            "fontSize": 2,
            "rotate": 0,
            "bold": 0,
            "reverse": false,
            "underline": false
          }, {
            "printtype": 1,
            "x": 5,
            // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
            "y": (h * this.pickinglist.length) + 510 + 100 + 200 + 150,
            "printcontent": `尊敬的顾客，如您对订单有任何疑问，请用天猫或淘宝APP扫描下方猫超二维码`,
            "fontSize": 2,
            "rotate": 0,
            "bold": 0,
            "reverse": false,
            "underline": false
          }, )
          }
          if(changecode==7){

          }
           else if(qrcode == 6){
              msg.data.push({
                "printtype": 1,
                "x": 350,
                "y": h * this.pickinglist.length + 510 + 390 + 110,
                "printcontent": "猫超客服二维码",
                "fontSize": 2,
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              }, {
                "printtype": 3,
                "x": 350,
                "y": h * this.pickinglist.length + 510 + 390 + 150,
                "printcontent": "https://ai.alimebot.taobao.com/intl/index.htm?from=Y1KuElkn1U",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },

            )
            }else if (qrcode == 3) { //三个二维码
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
          } else if (qrcode == 5) { // 京东到家
            msg.data.push({
                "printtype": 3,
                "x": 350,
                "y": h * this.pickinglist.length + 510 + 390 + 150,
                "printcontent": "http://dj-store-gw.jd.com/qrcode/qrCodeRedirect?type=1&linkId=329840",
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

    



        }
        if (autoprint) {
          this.autoprint(msg, printstate)
        } else {
          console.log(msg)
          this.$bridge.callHandler('BlueprinterCall', msg, (res) => {
            this.callprintlog();
          })
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
            layer.close(index);
            this.$bridge.callHandler('BlueprinterCall', msg, (res) => {

            })
            if (this.pickingstate) {
              layer.msg('拣货完成');
              Router.push({
                name: 'OrderList'
              })
            }

          },
          btn2: (index) => {  

            if (this.pickingstate) {
              layer.msg('拣货完成');
              Router.push({
                name: 'OrderList'
              })
              layer.close(index);

            }
          }

        });
        this.tipscss()
      },
      goBack() {
        var that = this
        if (this.readypicking) {
          layer.open({
            title: '',
            className: 'pickingTips',
            content: '确定离开？',
            skin: "demo-class",
            btn: ['确定', '取消'],
            yes: function (index) {
              that.unlockList(that.orderNo, store.state.cempno)
              Router.push({
                name: 'OrderList'
              })
              layer.close(index);
            },
            no: function (index) {
              layer.close(index);
            }
          });
          that.tipscss()
        } else {
          that.unlockList(this.orderNo, store.state.cempno)
          Router.push({
            name: 'OrderList'
          })

        }
      },
      unlockList: function (orderNo, lockId) {

        var url = store.state.runurl + "/watsons/rest/gateway/kms/onstore/admin/common/order/unlockPick";
        var t = store.state.token
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
            "Token": store.state.token,
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
        this.$set(this.Shortage, "storeNo", store.state.storeNum)

        this.$set(this.Shortage, "creater", store.state.cempno)
        this.$set(this.Shortage, "orderChannel", store.state.channelArr)
        this.$set(this.Shortage, "items", [])


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

            if (store.state.channelArr == this.changnnellistCN[a]) {
              store.state.channelArr = this.changnnellist[a]
            }

          }

          if(!this.notAllPicking){
            this.unavailable(this.orderItem.orderNo)
                // console.log('toShortage')
              }else{
                layer.open({
            title: "缺货操作提示",
            className: 'pickingTips',
            type: 1,
            content: $('#unaTips'),
            skin: "demo-class",
            btn: ['确定', '取消'],
            yes: (index) => {
              // location.reload();
              this.unavailable(this.orderItem.orderNo)
              layer.close(index);
            },
            no: function (index) {
              layer.close(index);
            }
          });
              } 
       

          this.tipscss()
          $(".layui-layer-btn0").css("background", "#FAE100")
          $(".layui-layer-btn0").css("color", "#000")
          $(".layui-layer-btn1").css("border", "none")
          $(".layui-layer-content").css("display", "flex")
          $(".layui-layer-content").css("justify-content", "center")
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

        $(".layui-layer-setwin").css("display", "none")



      },

      unavailable(orderNo) { //缺货逻辑
        layer.load(2);

        var url = store.state.runurl + "/onstore/admin/common/order"
        if (this.UnavailableItemState) {

          url += "/addUnavailableItem"
        } else {

          url += "/insertUnavailableItem"
        }
        var t = store.state.token
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
              store.state.beforeOrderNum = orderNo //如果跳出页面，才记录，停在页面不记录当前订单号
              Router.push({
                name: 'OrderList'
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
              if(!this.notAllPicking){
                
                this.pickingPocket(orderNo)
                // console.log('toShortagefromnotallpicking')
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
            layer.msg('缺货报告失败:'+res.msg);
          }

          // 提示用户已经拣货完毕，弹出对话框，然后后返回到上一页
        }, function (res) {
          //失败之后处理逻辑
          //loadding取消
          //提示无数据
          layer.closeAll('loading')
          layer.msg('缺货报告异常，请联系管理员:'+res.msg);

        })
      },

      closeselecttips(i) {
        this.readypicking = true
        if (i != "a") {
          this.selectindex = i
        }
        this.showselectstate = !this.showselectstate
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
        if (store.state.phonetype == "ios") {

          this.$bridge.registerHandler('scanResult', (data, responseCallback) => {
            // alert('app主动调用js方法，传入数据:'+ data)
            // alert("//"+data)
            var result = false
            var count = 0
            for (var i = 0; i < this.pickinglist.length; i++) {
              //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
              if (that.pickinglist[i].store_barcode.indexOf(data) != -1) {
                result = true
                count = i
              }
            }

            if (result) {
              that.addCount(count)
            } else {
              layer.msg('货号不匹配，请重扫');
            }
            responseCallback(data)
          })

        }

        this.$bridge.registerHandler('scanCallback', (data, responseCallback) => {
          // alert('app主动调用js方法，传入数据:'+ data)
          // alert("//"+data)
          var result = false
          var count = 0
          for (var i = 0; i < this.pickinglist.length; i++) {
            //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
            if (that.pickinglist[i].store_barcode.indexOf(data) != -1) {
              result = true
              count = i
            }
          }

          if (result) {
            that.addCount(count)
          } else {
            layer.msg('货号不匹配，请重扫');
          }
          responseCallback(data)
        })

        if (store.state.phonetype == "urovo" || store.state.phonetype == "TC51" || store.state.phonetype == "UBX" ||
          store.state.phonetype == "DT50") {


          this.$bridge.registerHandler('redScanCodeCall', (data, responseCallback) => {
            // alert('app主动调用js方法，传入数据:'+ data)
            // alert("//"+data)
            var result = false
            var count = 0
            for (var i = 0; i < this.pickinglist.length; i++) {
              //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
              if (that.pickinglist[i].store_barcode.indexOf(data) != -1) {
                result = true
                count = i
              }
            }

            if (result) {
              that.addCount(count)
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

            console.log("res==============" + res)
            if (res == 1) {
              this.showprint(0, true)
              this.canprintType = true
            }
          })
   



      },
      initmapstate(){

let s = "../static/map/map.json";
if (this.$store.state.env == "0") {
s = "../../KMS/static/map/map.json";
}
axios.get(s).then(
res => {
  if(res.data.state==1){
    this.mapstate = true
    this.mapurl = res.data.mapurl
  }
  
},
res => {
  console.log("error");
  layer.msg("测试店铺信息获取失败，请联系管理员");
}
);
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
        if(this.orderItem.allowOutStockPick){
          this.notAllPicking = false
        }

        if (store.state.beforeOrderNum == this.orderNo) {

          layer.open({
            title: '',
            className: 'pickingTips',
            content: '当前拣货单已操作，请不要重复操作',
            skin: "demo-class",
            btn: ['确定'],
            yes: function (index) {
              Router.push({
                name: 'OrderList'
              })
              layer.closeAll()
            }
          });
          this.tipscss()
        }
        var totalcount = 0
        if (this.orderItem.unavailable == "1") {
          this.UnavailableState = true
        }
        for (var i = 0; i < this.pickinglist.length; i++) {

          if (this.pickinglist[i].itemFlag == "D") {
            this.goodsstateText.push("")
          } else {
            this.goodsstateText.push("待拣货")
            this.$set(this.pickinglist[i], "reasonText", "缺货原因")

          }
          this.goodsstate.push(true)
          this.goodsCount.push(0)
          this.goodstotalcount++
          var count = this.pickinglist[i].orderQty
          totalcount = Number(totalcount) + Number(count)

        }

        this.goodstotalcount = totalcount

      },

      pickingPocket: function (orderNo) {
        layer.load(2);
        let url = store.state.runurl + "/watsons/rest/gateway/kms/onstore/admin/common/order/picking";
        let t = store.state.token
        let d = {
          'orderNo': orderNo,
          'lockId': store.state.cempno
        }
          let returnDataList = []
        if(this.orderFrom.startsWith("天猫商城")){
          d['version'] = this.orderItem.version
        }
        if(this.orderItem.allowOutStockPick){
          
          this.pickinglist.forEach((item,i) => {
            if(item.itemFlag!="D"){
           
              item.pickupQty  = this.goodsCount[i]
              let returnData = {
                'pickupQty':this.goodsCount[i],
                'itemNo': item.itemNo,
                'itemName':item.itemName,
                'uuitId':item.uuitId,
                'orderqty':item.orderQty,
          }
          returnDataList.push(returnData)
        }
          });
          returnDataList = JSON.stringify(returnDataList)
          d["returnData"] = returnDataList  
           
        }
        $.ajax({
          type: 'POST',
          url: url,
          data:d,
          datatype: "json",
          headers: {
            "Token": t,
            'Content-Type': 'application/x-www-form-urlencoded'

          }
        }).then((res) => {
          layer.closeAll('loading')

          if (res.code == 0) {
            //提示
          
            store.state.beforeOrderNum = orderNo
            this.readypicking = false
            this.pickingstate = true
            let result = this.goodsCount.find((value, index, arr) => {
              return value >0 
            })
                        if(result){
              this.showprint(1, true)
            }else{
              this.$router.push({
                name: 'OrderList'
              })
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
          } else if(res.msg.startsWith("订单版本号不一致，请重新拣货")){
   layer.open({
              title: '',
              className: 'pickingTips',
              content: '当前订单货物已更新，请回到拣货列表',
              skin: "demo-class",
              btn: ['好的','取消'],
              yes:  (index) => {
                // location.reload();
                Router.push("OrderList")

                layer.close(index);
              },  no:  (index)=> {
                // location.reload();

                layer.close(index);
              }
            });
            this.tipscss()
          }else {
            layer.msg('拣货失败:'+res.msg);
          }

          // 提示用户已经拣货完毕，弹出对话框，然后后返回到上一页
        }, function (res) {
          //失败之后处理逻辑
          //loadding取消
          //提示无数据
          layer.closeAll('loading')
          layer.msg('拣货异常，请联系管理员');

        })
      },





      toDetail: function () {
        Router.push({
          name: 'OrderList'
        })

      },
      resetbackground: function () {

        var h = $(window).height()
        var topheight = $(".title").height()
        var DetailsTitle = $("#DetailsTitle").height()


        h = h - DetailsTitle - topheight
        // h=h*0.9
        $("#third").css("height", h * 0.85)
        //        $(".index").css("height",h*0.7)
      },
      // showScanPocket:function(){

      // },

      getProductByItemCode: function () {
        // http://10.82.25.197:8081
        var u = store.state.runurl + "/watsons/rest/gateway/p360/api/getAppointProductByItems"
        var codeList = []
        for (var i = 0; i < this.pickinglist.length; i++) {

          codeList.push(this.pickinglist[i].itemNo)
        }
        var data = {
          // "storeNo":store.state.storeNum,
          "storeNo": store.state.storeNum,

          codeList,
          "fieldList": ["product_image", "product_base", "product_comments", "store_price", "product_ma",
            "product_osd", "product_planogram", "product_mc", "product_med", "product_cb", "product_property"
          ]
        }
        var that = this
        axios.post(u, data).then(res => {
          console.log(res)
          if (res.data.is_success) {
            //找到对应的商品，然后显示
            //1.无陈列号    2.有一个陈列号      3有多个陈列号
            // 1. 无就补""    即可
            // 2. 有一个则 赋值到 planogram
            var planogram = []
            var product_baselist = []
            //  res.data.data.product_base.product_base
            for (var i = 0; i < res.data.data.product_list.length; i++) {
              planogram.push(res.data.data.product_list[i].product_planogram)
              product_baselist.push(res.data.data.product_list[i].product_base)
              this.$set(this.pickinglist[i], "item", planogram[i].item)
              // this.pickinglist[i].planogram_idarr = []
              //如果product_planogram 数组>1   push进去
              if (planogram[i] != "" && planogram[i] != undefined && res.data.data.product_list[i].itemCode ==
                this.pickinglist[i].itemNo) { //对比当前列的itemno 和拿到的itemno是否相同
                //无论有多少个

                // 旧逻辑，直接把第1个陈列号显示
                // this.$set(this.pickinglist[i],"planogram_id", planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)


                // ============================================================
                // 12001B02C070065     13002U07A010101    13002U07A010102
                // ==============================================================

                if (planogram[i] != null && planogram[i].length > 1) {
                  var rearr = []
                  for (var q = 0; q < planogram[i].length; q++) {
                    //检查陈列号 第6位数字是否为7的话优先显示
                    var re = planogram[i][q].planogram_id + planogram[i][q].plan_level + planogram[i][q]
                      .plan_seq + planogram[i][q].plan_Facing
                    // var re = '12001B72C070065'
                    console.log("re====" + re)
                    // &&this.pickinglist[i].planogram_id!=undefined&&this.pickinglist[i].planogram_id!=""
                    if (re.substr(6, 1) == "7") {
                      // console.log('re===这个是7的陈列号====='+re);
                      this.$set(this.pickinglist[i], "planogram_id", re)
                    }

                    rearr.push(re)

                    $("#forid_" + i).css("display", "inline-block");

                  }
                  this.planogramId.push(rearr)
                  var a = this.planogramId
                  console.log("planogramId=======" + a)
                } else {
                  this.$set(this.pickinglist[i], "planogram_id", planogram[i][0].planogram_id + planogram[i][0]
                    .plan_level + planogram[i][0].plan_seq + planogram[i][0].plan_Facing)
                  this.planogramId.push(planogram[i][0].planogram_id + planogram[i][0].plan_level + planogram[i]
                    [
                      0
                    ].plan_seq + planogram[i][0].plan_Facing)
                }


              } else {
                this.$set(this.pickinglist[i], "planogram_id", "")
                this.planogramId.push("")
              }

              if (product_baselist[i].store_barcode == "" || product_baselist[i].store_barcode == undefined) {
                this.$set(this.pickinglist[i], "store_barcode", "")

              } else {
                this.$set(this.pickinglist[i], "store_barcode", product_baselist[i].store_barcode)

              }



              // console.log("  this.pickinglist[i].store_barcode======="+  this.pickinglist[i].planogram_id)

              // var pickinglisttemp = that.pickinglist
              // console.log("planogram============"+planogram)
              // for(var i =0;i<)
              // this.pickinglist
            }

            // for(var i =0;i<res.data.data.product_base.length;i++){


            // }

          } else {
            //提示货品不匹配，无法拣货
            layer.msg('货品条码获取不成功，请联系管理员');

          }
        })
      },

      //       resetbackground:function(){

      // var h =   $(window).height()
      //        var topheight = $(".top").height()

      //        // h = h - topheight
      //        // h=h*0.9
      //        var orderheight = $(".orderlist").height()
      //        // $(".orderlist").css("height",h)
      //        $(".index").css("height",h*0.7)
      //        $("#third").css("height",h*0.6)

      // },

      gopicking(buttonstate) {
        var b
        let allgoodsstate= false
        if (this.UnavailableState) {

          for (var a = 0; a < this.pickinglist.length; a++) {

            // 如果有缺货登记的情况，先把缺货登记的数量显示出来


            if (this.pickinglist[a].AfterShortageGoodsCount != undefined && this.goodsCount[a] != this.pickinglist[
                a]
              .AfterShortageGoodsCount && this.pickinglist[a].itemFlag != "D") {
              layer.msg("数量有误，请重新检查")
              return
            } else if (this.pickinglist[a].AfterShortageGoodsCount == undefined && 
            this.pickinglist[a].orderQty != this.goodsCount[a] && this.pickinglist[a].itemFlag != "D") {
              layer.msg("数量有误，请重新检查")
              return
            } else {
              b = true

            }
          }
        }
        else {

          for (var a = 0; a < this.pickinglist.length; a++) {
            // 如果有缺货登记的情况，先把缺货登记的数量显示出来
            if(this.pickinglist[a].reason){
              b = true
            }
           else if (this.pickinglist[a].orderQty != this.goodsCount[a] && this.pickinglist[a].itemFlag != "D") {
              layer.msg("数量有误，请重新检查")
              return
            } else {
              b = true
              allgoodsstate = true
            }
          }
        }

        if (b) {
          // layer.msg("准备拣货")
          let msg = this.notAllPicking ? '':'当前单允许部分出货，'
          
          layer.open({
            title: '',
            className: 'pickingTips',
            content: msg+'您确定拣货？',
            skin: "demo-class",
            btn: ['确定', '取消'],
            yes: (index) => {
              console.log(this.orderItem.orderNo)
              // this.pickingPocket(this.orderItem.orderNo)
              if(!this.notAllPicking&&!allgoodsstate){//是天猫单
                
                this.toShortage()
                // console.log('toShortage')
              }else{
                console.log('pickingPocket')
                this.pickingPocket(this.orderItem.orderNo)
              } 
              
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
        }
        //  else if (this.orderItem.allowOutStockPick){
        //   topicking = true
        // }
        else {


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
          layer.open({
            title: '',
            className: 'pickingTips',
            content: '您确定拣货？',
            skin: "demo-class",
            btn: ['确定', '取消'],
            yes: (index) => {
              // location.reload();
              this.pickingPocket(this.orderItem.orderNo)

              layer.close(index);
            }
          });
          this.tipscss()

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
        console.log('this.orderItem.version----',this.orderItem.version)
        if(this.orderItem.version> 0){
          this.changeOrderState = true
        }

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
      initreasonlist(){
        let s = "../static/reasonList/reasonList.json";
    if (store.state.env == "0") {
      s = "../../KMS/static/reasonList/reasonList.json";
    }
    axios.get(s).then(
      res => {
        this.reasonarr = res.data;
      },
      res => {
        console.log("error");
        layer.msg("原因信息获取失败，请联系管理员");
      }
    );
      },
      initchannelcnlist(){
        let s = "../static/channelList/channelListCn.json";
    if (store.state.env == "0") {
      s = "../../KMS/static/channelList/channelListCn.json";
    }
    axios.get(s).then(
      res => {
        this.changnnellistCN = res.data;
      },
      res => {
        console.log("error");
        layer.msg("渠道信息获取失败，请联系管理员");
      }
    );
      },
      initchannelenlist(){
        let s = "../static/channelList/channelListEn.json";
    if (store.state.env == "0") {
      s = "../../KMS/static/channelList/channelListEn.json";
    }
    axios.get(s).then(
      res => {
        console.log(res.data)
        this.changnnellist = res.data;
      },
      res => {
        console.log("error");
        layer.msg("渠道信息获取失败，请联系管理员");
      }
    );
      }

    },
    //   beforeRouteLeave(to, from, next) {
    //   layer.closeAll()
    // },
    beforeMount() {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        // window.addEventListener('popstate', this.goBack, false);
      }
      this.initmapstate();
      this.initchannelcnlist()
      this.initchannelenlist();
      this.initreasonlist();
      this.resetbackground()
      this.pickinginit();
      this.getProductByItemCode()
      this.getAPPDate();
      this.sendMsg()
      this.canshowCount();
      this.init()
      this.callprintLog()


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
  }

  .goodslist1 div {
    display: inline-block;

  }

  .list1 div {
    display: inline-block;
    /* padding-left: 1rem; */
    font-weight: 600;
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

  .list2 div {
    display: inline-block;
    font-size: 0.8rem;
  }

  .list1 {
    margin-bottom: 0.5rem;
    padding-top: 0.5rem;
  }

  .orderlist {
    /* padding-bottom: 0.8rem;
    border-bottom: 1px solid #f2f2f2; */
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
    left: 2rem;
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
    padding-right: .5rem;
    float: right;
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
    background: #E6E6E6;
    padding-top: 3rem;
    /* padding: 0.5rem; */
  }

  .title {
    position: fixed;
    width: 100%;
    top: 0;
    background: #fff;
    z-index: 99;
    height: 3rem;
    text-align: center;
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
    /* z-index: 200; */
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
  .notalldisplay{
    width: 50%;
  }
  .notallundisplay{
    width: 100%;
  }

</style>
