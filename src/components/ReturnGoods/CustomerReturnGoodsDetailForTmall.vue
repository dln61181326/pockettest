<template>
  <div class="index">
    <!-- <nav class="navbar navbar-inverse navbar-fixed-top top"> -->
    <nav class="navbar navbar-inverse navbar-fixed-top title" id="bar">
      <!-- <img class="backPoint clearfix:after" src="../../assets/backPoint.png"  @click="$router.back(-1)"> -->
      <img
        class="backPoint clearfix:after"
        src="../../assets/backPoint.png"
        @click="goBack()"
      />

      <div id="title" class="titlename">退货入库单明细</div>
      <img
        class="cameraIcon"
        @click="showcamerascan()"
        v-if="showCamera"
        src="../../assets/cameraIcon.png"
      />

      <div class="clearfix"></div>
    </nav>

    <div id="DetailsTitle" class="navbar navbar-inverse navbar-fixed-top ">
      <div class="four" v-if="allorderstate">
        货品数量已与订单数量相等
      </div>

      <div class="orderlist">
        <div class="orderlistContent">
          <div class="list1">
            <div class="ordernum clearfix:after" v-if="orderlistSearchKey!='退仓单号/快递单号'">{{ orderNo }}</div>
            <div class="ordernum clearfix:after"v-if="orderlistSearchKey=='退仓单号/快递单号'">{{ order.wlNo }}</div>

            <!-- <div class="totalprice clearfix:after">￥{{ orderAmt }}</div> -->

            <div class="clearfix"></div>
          </div>
          <div class="list2 ">
            <div class="channelText" v-if="orderFrom">
              {{ orderFrom }}
            </div>
            <div class="orderDate"> 共 <span class="totalcount">{{ goodstotalcount }}</span> 件商品</div>
            <div class="price">
             
            </div>
          </div>

          <!-- <div class="list3">
            <div class="bookingTime">预约取货时间：{{ orderDate }}</div>
            <div id="checkstate" class="checkstate">{{ checkstate }}</div>
          </div> -->
        </div>
      </div>
    </div>

    <div id="third">
      <div class="orderlist">
        <!--  v-for="(dataList,index) in orderItem" -->
        <!-- @click="showScanPocketstate=!showScanPocketstate" -->
        <div class="orderlistContent" v-for="(dataList, index) in pickinglist">
          <div class="goodslist1">
            <div class="goodsordernum">{{ dataList.skuCode }}</div>
            <div class="goodsmoudle">{{ dataList.planogram_id }}</div>
            <!-- v-if="moudleismore(index)" -->
            <span
              :id="forId(index)"
              class="moreplanogram"
              @click="showgoodsmoudle(index, $event)"
              >...</span
            >
            <!-- v-bind:class="[starArr[index]==5 ? choosestar : nochoosestar]" -->
            <!-- <input  class="clearfix:after":id="goodsstateforId(index)"  v-bind:class="[goodsstate[index] ? pickinggoodsstate : okgoodsstate ]" v-model="goodsstateText[index]" readonly="readonly"></input> -->

            <div class="clearfix"></div>
          </div>
          <div class="goodslist2">
            <div class="orderName">{{ dataList.itemName }}</div>
            <div class="goodsprice clearfix:after" v-if="goodlist4show(index)">
              x
              <span class="quantityCount">{{ dataList.orderQty }}</span>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="goodslist3" :id="goodslist3(index)" >
            <span class="scanCount">扫描数量</span>
            <span class="cut" @click="cutCount(index)">-</span>
            <input
              class="count"
              type="number"
              v-on:blur="onbl(index)"
              @keyup.enter="onbl(index)"
              v-on:focus="inputfocus(index)"
              v-model="goodsCount[index]"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            />
            <span class="add" @click="addCount(index)">+</span>

            <!-- <span class="quantity ">
                         x
                         <span class="quantityCount">{{dataList.returnNum}}</span>
                         
                       </span> -->
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="ButtonGroup">
      <div
        v-if="allgoodsreturnstate"
        class="packagestate"
        @click="choiceAllGoodsReturn()"
      >
        <img class="placeIcon" src="../../assets/allchoice.png" />
        <span class="packagestatetxt">全部退货</span>
        <span
          class="floatCheckBox clearfix:after"
          v-bind:class="[
            allgoodsreturnclass == true
              ? returngoodschoicestate
              : returngoodsunchoosestate
          ]"
        ></span>
        <div class="clearfix"></div>
      </div>
      <div
        v-if="false"
        class="packagestate"
        @click="choicepackageState()"
      >
        <img class="placeIcon " src="../../assets/packageIcon.png" />
        <span class="packagestatetxt">包装是否有损坏？</span>
        <span
          class="floatCheckBox clearfix:after"
          v-bind:class="[packagestateselect == 1 ? choicestate : unchoosestate]"
        ></span>
        <div class="clearfix"></div>
      </div>
      <div
        id="pickbutton"
        class="goodsTipsButton clearfix:after"
        @click="checkreturnGoodListCount()"
      >
        {{ returnButtonTitle }}
      </div>
      <!-- <div0
        id="nopickbutton"
        class="goodsTipsButton clearfix:after"
        @click="showselectstate = true"
      >
        {{ reasonTxt }}
      </div0> -->
      <div class="clearfix"></div>
    </div>

    <!-- <div class="maskBoxblack TipsMask" v-if="showScanPocketstate" >
              <span class="TipsBox maskBox" >
                <div class="PocketDiv">
                  
                  <div class="PocketTitle">
                     请扫描袋号
                  </div>
                  <input type="text" class="PocketNum"onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
                  <div id="closePocketDiv" @click="showScanPocketstate=!showScanPocketstate">
                      <img class="closeImg " src="../../assets/backPoint.png" >
                  </div>
                </div>
                  </span>
                  </div> -->

    <div v-if="false" class="spec-menu">
      <div class="spec-menu-box">
        <div class="spec-menu-middle">
          <div class="nature-box">
            <div class="pro-att clear">
              <span class="spec-tit">{{ reasonTitle }}:</span>
              <img
                class="closeselect "
                src="../../assets/close.png"
                @click="showselectstate = false"
              />
            </div>
          </div>
        </div>
        <!-- /规格、属性 -->
        <!-- 按钮 -->

        <div class="returnBox">
          <div
            id="customreturn"
            class="list"
            v-for="(reason, index) in reasonlist"
            @click="confirmReason(index)"
          >
            <span class="listcontent">
              <span class="thirdTitle ">{{ reason }}</span>
              <img class="point" src="../../assets/point.png" />
              <div class="clearfix"></div>
            </span>
          </div>
        </div>
      </div>
      <div class="spec-menu-btn clear">
        <span href="#" class="confirmSelect" @click="showreasonBox()"
          >确定</span
        >
      </div>
      <!-- /按钮 -->
    </div>

    <!-- <div v-if="showselectstate"class="spec-menu" >
                    <div class="spec-menu-box">
                      <div class="spec-menu-middle">
                        <div class="nature-box">
                          <div class="pro-att clear">
                            <span class="spec-tit">缺货原因:</span>
                            <img class="closeselect " src="../../assets/close.png"  @click="closeselecttips('a')">

                            <p >
                              <span :id="getreasonid(1)" @click="selectReason(1)">库存缺货</span>
                              <span :id="getreasonid(2)"  @click="selectReason(2)">近效期或破损</span></p></p>
                          </div>
                        </div>
                      </div>
                      <div class="spec-menu-btn clear">
                        <span href="#" class="confirmSelect" @click="choicereason()"    >确定</span>
                      </div>
                    </div>
                  </div> -->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "HelloWorld",
  data() {
    return {

      orderlistSearchKey:"",
      showselectstate: true,
      goodsCount: [],
      changnnellist: [],
      changnnellistCN: [],
      readypicking: false,
      keyboardshow: true,
      goodsCountbak: [],
      allgoodsreturnstate: true,
      allorderstate: false,
      planogram: [],
      returnButtonTitle: "退货",
      reasonArr: [],
      allgoodsreturnclass: false,
      returngoodsunchoosestate: "nocheck",
      returngoodschoicestate: "allgoods",
      choicestate: "all",
      unchoosestate: "nocheck",
      picklistitem: [],
      packagestateselect: 0, //包装状态 0-正常，1-异常
      showcountstate: true,
      Shortage: {}, //缺货字段
      expectedDeliveryTime: "",
      orderAmt: "",
      orderNo: "",
      goodsmoudlecount: true,
      goodstotalcount: 0,
      planogramId: [],
      selectReasonoption: "",
      showCamera: true,
      reasonlist: [],
      orderDate: "",
      orderFrom:this.$route.query.orderFrom,
      scanbarcode: "",
      ordertotalcount: 0,
      shortpickreasontext: [],
      itemindex: "",
      packageshowstate: false,
      p360itemcode: "", //
      orderlockstate: "",
      checkstate: "", //捉取sendState 拣货状态
      tipsstate: "",
      selectindex: "",
      reasonTxt: "退回原因",
      reasonTitle: "退回原因",
      goodsstate: [],
      pagetitle: "退货入库",
      reasonselect: [],
      orderlist: this.$store.state.orderlist,
      keyarr: [],
      pickinggoodsstate: "pickinggoodsstate",
      okgoodsstate: "okgoodsstate",
      goodsstateText: [],
      packagestateshow: false,
      orderItem: "",
      pickinglist: [],
      order:{}
    };
  },

  methods: {
    checkreturnGoodListCount(){
      // this.goodsCount[index]
         let result = this.goodsCount.find((value, index, arr) => {
              console.log("arr", arr)
              return value >0
            })

              layer.open({
          title: "",
          className: "pickingTips",
          content: result?"准备提交？":"货物数量为0，确定提交？",
          skin: "demo-class",
          btn: ["确定","取消"],
          yes: (index) =>{
            this.goReturnGoodList()
          },no:(index)=>{
            layer.closeAll()
          }
        });
        this.tipscss();
    },
    choicepackageState() {
      if (this.packagestateselect == 1) {
        this.packagestateselect = 0;
      } else {
        this.packagestateselect = 1;
      }
    },
    goBack() {
      this.leaveTips();
    },
    leaveTips() {
      var that = this;
      // if(this.readypicking){
      layer.open({
        title: "",
        className: "pickingTips",
        content: "确定离开？",
        skin: "demo-class",
        btn: ["确定", "取消"],
        yes: index => {
          this.$router.push({ name: "ReturnGoodsListForTmall" });
          layer.close(index);
        },
        no: index => {
          layer.close(index);
        }
      });
      that.tipscss();
    },
     goReturnGoodList(){
       layer.load(2);
        let s = `${this.$store.state.runurl}/onstore/admin/express/confirmReceipt`;
      // let s =   "http://10.82.26.249:8888/onstore/admin/express/confirmReceipt"
          let details = []
        let data = {
          returnNo:this.$route.query.rid,
          orderNo:this.orderNo,
          expressId:null,
          expressName:null,
          orderType:this.order.orderType,
          storeId:this.$store.state.storeNum,
          oid:this.order.oid,
        }
        this.pickinglist.forEach((item,index)=>{
          let detail ={
            'rid':item.rid,
            'itemName':item.itemName,
            'itemNo':item.skuCode,
            'qtyToReceive':this.goodsCount[index],
            'itemAmount':item.actualPrice,
            'itemPrice':item.lineAmount,
            'resonCode':item.resonCode,
            'unitId':item.unitId,
            'parentUnitId':item.parentUnitId
          }
          details.push(detail)

        })
        // details = JSON.stringify(details)
        data["details"] = details
        let headers = {token:this.token}
    this.$axios.post(s,data,
   {
    headers:{
        'token':this.$store.state.token
    }
}
  ).then(
      res => {
        layer.closeAll()
        if(res.data.code===0){
          layer.msg('操作成功')
          this.$router.push({name:"ReturnGoodsListForTmall"})
        }else{
           layer.msg(res.data.msg)
        }
      },
      res => {
        layer.closeAll()
        layer.msg("操作不成功:"+res.data);
      }
    );
      },

    initchannelcnlist(){
        let s = "../static/channelList/channelListCn.json";
    if (this.$store.state.env == "0") {
      s = "../../KMS/static/channelList/channelListCn.json";
    }
    this.$axios.get(s).then(
      res => {
        console.log(res.data)
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
    if (this.$store.state.env == "0") {
      s = "../../KMS/static/channelList/channelListEn.json";
    }
    this.$axios.get(s).then(
      res => {
        console.log(res.data)
        this.changnnellist = res.data;
      },
      res => {
        console.log("error");
        layer.msg("渠道信息获取失败，请联系管理员");
      }
    );
      },
    confirmorderFrom(){
      
      let s = "../static/printstoreList.json";
    if (this.$store.state.env == "0") {
      s = "../../KMS/static/printstoreList.json";
    }
    this.$axios.get(s).then(
      res => {
        this.testprintstore = res.data;
        if(this.testprintstore.length>0){
          this.testprintstore.forEach((data) => {
            if(this.$store.state.storeNum == data){
              this.$store.state.canprintType = true
            }
});
        
        }  if(this.testprintstore.length==0){
          store.state.canprintType = true
        }
      },
      res => {
        console.log("error");
        layer.msg("测试店铺信息获取失败，请联系管理员");
      }
    );
    },
    getOrderDetail(rId) {
        layer.load(2);
      var url =`${this.$store.state.runurl}/onstore/admin/express/warehousingDetail`;
      var t = this.$store.state.token;
      let d = {
        rId: rId
      };
      
      $.ajax({
        type: "post",
        data: d,
        url: url,
        headers: {
          Token: t,
          "content-type": "application/x-www-form-urlencoded"
        }
      }).then(
        res => {
                 layer.closeAll('loading')    
          if (res.code == "0") {
           this.orderNo =  res.data.orderNo
          //  this.orderFrom = this.$router.query.orderFrom
          this.order  = res.data
           this.pickinglist = res.data.receiptDetails
            this.pickinginit();
             this.getProductByItemCode()
          } else if (res.code == 403) {
            layer.open({
              title: "",
              className: "pickingTips",
              content: "登录已过期，现准备重新登录",
              skin: "demo-class",
              btn: ["好的"],
              yes: index => {
                // location.reload();
                this.$router.push("/");

              }
            });

            this.tipscss();
          } else {
            layer.open({
              title: "",
              className: "pickingTips",
              content: "订单信息获取异常",
              skin: "demo-class",
              btn: ["好的"],
              yes: index => {
                // location.reload();
                this.$router.push("ReturnGoodsListForTmall");

                layer.close(index);
              }
            });

            this.tipscss();
            
          }
        },
        function(res) {
          //失败之后处理逻辑
          //loadding取消
          //提示无数据
          //提示
          layer.closeAll("loading");

          layer.msg("查询数据有问题，请重试");
        }
      );
    },
    backTopPage() {},
    inputfocus(i) {
      this.keyboardshow = false;
      this.$set(this.goodsCount, i, "");
    },
    forId: function(index) {
      return "forid_" + index;
    },

    goodsstateforId(index) {
      return "goodsstateforId" + index;
    },


    tipscss() {
      $(".layui-layer-btn1").css("border", "none");
      $(".layui-layer-btn0").css("border", "none");
      $(".layui-layer-btn0").css("border", "none");
      $(".layui-layer-btn0").css("background", "#009E96");
      $(".layui-layer-close2").css("display", "none");
    },


    closeselecttips(i) {
      this.readypicking = true;
      // if(i!="a"){this.selectindex = i}
      this.showselectstate = !this.showselectstate;
      this.reasonArr = this.reasonlist[i];
      this.itemindex = i;
    },

    choicereason() {
      // 1.把当前选了reason的itemlist，加入reason，加入已拣数量，放进缺货list中
      // 2.
      //
      this.closeselecttips("a");
      this.$set(
        this.pickinglist[this.selectindex],
        "reason",
        this.selectReasonoption
      );
      if (this.selectReasonoption == "1001") {
        this.$set(this.pickinglist[this.selectindex], "reasonText", "库存缺货");
        this.$set(this.pickinglist[this.selectindex], "reason", "1001");
      } else if (this.selectReasonoption == "1002") {
        this.$set(
          this.pickinglist[this.selectindex],
          "reasonText",
          "近效期或破损"
        );
        this.$set(this.pickinglist[this.selectindex], "reason", "1002");
      }
      // var t = this.pickinglist[this.selectindex]
    },

    selectReason(i) {
    },
    getObjectValues(object) {
      var values = [];
      for (var property in object) values.push(object[property]);
      return values;
    },
    confirmReason(i) {
      var r = this.reasonlist[i];
      this.reasonTxt = r;
      //  console.log('re===='+re)

      this.showselectstate = false;
    },
    goodlist4show: function(index) {
      if (this.pickinglist[index].itemFlag == "D") {
        return false;
      } else {
        return true;
      }
    },

    getreasonid(i) {
      return "reasonid" + i;
    },

    goodslist3: function(index) {
      return "goodslist3" + index;
    },

    canshowCount: function() {
      for (var count = 0; count < this.pickinglist.length; count++) {
        if (this.pickinglist[count].itemFlag == "D") {
          //把免拣货的数量== 库存数量           例如 购物袋x200   邮费x1
          $("#goodslist3" + count).css("display", "none");
        }
      }
    },

    moudleismore: function(index) {
      // console.log("this.pickinglist[index].planogram_id============="+this.pickinglist[index].planogram_id)
      // return false
      if (this.planogramId != null && this.planogramId.length > 1) {
        return true;
      } else {
        return false;
      }
    },

    showcamerascan() {
      let msg = this.msg;
      var phoneType = window.sessionStorage.phoneType;
      if (phoneType == "android") {
        this.$bridge.callHandler("scanCodeCall", msg, res => {});
      } else {
        this.$bridge.callHandler("callScan", msg, res => {
          // 处理返回数据
        });
        // this.IOSgetScanCode()
      }
    },

    getAPPDate() {
      if (this.$store.state.phonetype == "ios") {
        this.$bridge.registerHandler("scanResult", (data, responseCallback) => {
          // alert('app主动调用js方法，传入数据:'+ data)
          // alert("//"+data)
          //   var result = false
          //   var count = 0
          //      for(var i =0;i<this.pickinglist.length;i++){
          //       //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
          //  if(that.pickinglist[i].store_barcode.indexOf(data) != -1){
          //   result = true
          //   count = i
          //  }
          //      }

          //      if(result){that.addCount(count)}else{        layer.msg('货号不匹配，请重扫');
          //        }
          responseCallback(data);
        });
      }

      this.$bridge.registerHandler("scanCallback", (data, responseCallback) => {
        // alert('app主动调用js方法，传入数据:'+ data)
        // alert("//"+data)
        var result = false;
        var count = 0;
        for (var i = 0; i < this.pickinglist.length; i++) {
          //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
          if (that.pickinglist[i].store_barcode.indexOf(data) != -1) {
            result = true;
            count = i;
          }
        }

        if (result) {
          this.addCount(count);
        } else {
          layer.msg("货号不匹配，请重扫");
        }
        responseCallback(data);
      });

      if (
        this.$store.state.phonetype == "urovo" ||
        this.$store.state.phonetype == "TC51" ||
        this.$store.state.phonetype == "UBX" ||
        this.$store.state.phonetype == "DT50"
      ) {
        this.$bridge.registerHandler(
          "redScanCodeCall",
          (data, responseCallback) => {
            // alert('app主动调用js方法，传入数据:'+ data)
            // alert("//"+data)
            var result = false;
            var count = 0;
            for (var i = 0; i < this.pickinglist.length; i++) {
              //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
              if (this.pickinglist[i].store_barcode.indexOf(data) != -1) {
                result = true;
                count = i;
              }
            }

            if (result) {
              this.addCount(count);
            } else {
              layer.msg("货号不匹配，请重扫");
            }
            responseCallback(data);
          }
        );
      }

      this.$bridge.registerHandler("userGoBack", (data, responseCallback) => {
        this.leaveTips();
      });
      // this.$bridge.registerHandler('userKeyBack', (data, responseCallback) => {
      //                 console.log("userKeyBack====================")

      // })
    },
    sendMsg() {
      let msg = this.msg;
      if (
        this.$store.state.phoneType == "urovo" ||
        this.$store.state.phoneType == "TC51" ||
        this.$store.state.phoneType == "UBX" ||
        this.$store.state.phonetype == "DT50"
      ) {
        this.$bridge.callHandler("redScanCodeCall", msg, res => {
          // alert('获取app响应数据:'+res)
          this.test = res;
        });
      } else if (
        this.$store.state.phoneType == undefined ||
        this.$store.state.phoneType == ""
      ) {
        this.$bridge.callHandler("redScanCodeCall", msg, res => {
          // alert('获取app响应数据:'+res)
          this.test = res;
        });
      }
      this.$bridge.callHandler("userKeyBack", msg, res => {
        // alert('获取app响应数据:'+res)
        // this.test = res
      });
    },

    showgoodsmoudle: function(index, event) {
      var planogramIdtemp = "";
      if (this.planogramId[index].length >= 1) {
        for (var i = 0; i < this.planogramId[index].length; i++) {
          if (i == 0) {
            planogramIdtemp = this.planogramId[index][i];
          } else {
            planogramIdtemp =
              planogramIdtemp + "</br>" + this.planogramId[index][i];
          }
          // planogramIdtemp.push("</br>")
        }
      }
      // this.pickinglist[index].planogramId
      console.log("planogramIdtemp==========" + planogramIdtemp);
      // console.log("=========event.currentTarget.target.id+index;"+event.target.id+index)
      var tips = layer.tips(planogramIdtemp, "#" + event.target.id, {
        tips: [4, "#000"],
        time: 5000
      });
    },

    pickinginit() {
      
     this.orderlistSearchKey =  this.$route.query.orderlistSearchKey
      let totalcount = 0;
      for (let i = 0; i < this.pickinglist.length; i++) {
        if (this.pickinglist[i].itemFlag == "D") {
          this.goodsstateText.push("");
        } else {
          this.goodsstateText.push("待检查");
          this.$set(this.pickinglist[i], "reasonTxt", "退货原因");
          this.$set(this.pickinglist[i], "planogram_id", this.pickinglist[i].skuCode);
          let count = 0;
            count = this.pickinglist[i].orderQty;
          totalcount = Number(totalcount) + Number(count);
        }
        this.goodstotalcount++;
        this.goodsstate.push(true);
        this.goodsCount.push(0);
      }
      this.goodstotalcount = totalcount;
    },

    pickingPocket: function(z) {
      layer.load(2);
      let url = store.state.runurl + "/onstore/admin/kms/return/savereturn";
      let f = JSON.stringify(z);
      let t = store.state.token;
      let q = { orderNo: this.orderNo, returnData: f };
      // console.log("JSON.stringify(a)===="+JSON.stringify(a))
      $.ajax({
        type: "post",
        url: url,
        cache: false,
        datatype: "json",
        data: q,
        headers: {
          Token: t,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(
        res => {
          layer.closeAll("loading");

          if (res.code == 0) {
            //提示
            layer.open({
              title: "",
              className: "pickingTips",
              content: "退货完成",
              skin: "demo-class",
              btn: ["好的"],
              yes: function(index) {
                Router.push({ name: "ReturnGoodsList" });

                layer.close(index);
              }
            });

            this.tipscss();
            // layer.msg('核销完成');
            store.state.beforeReturnOrderNum = orderNo;
            this.readypicking = false;
          } else if (res.code == 403) {
            var that = this;
            layer.open({
              title: "",
              className: "pickingTips",
              content: "登录已过期，现准备重新登录",
              skin: "demo-class",
              btn: ["好的"],
              yes: function(index) {
                // location.reload();
                Router.push("/");

                layer.close(index);
              }
            });

            that.tipscss();
          } else {
            layer.msg("退货失败，请重试");
          }

          // 提示用户已经拣货完毕，弹出对话框，然后后返回到上一页
        },
        function(res) {
          //失败之后处理逻辑
          //提示无数据
          layer.closeAll("loading");
          layer.msg("退货操作异常，请联系管理员");
        }
      );
    },

    toDetail: function() {
      Router.push({ name: "OrderList" });
    },
    resetbackground: function() {
      var h = $(window).height();
      var topheight = $(".title").height();
      var DetailsTitle = $("#DetailsTitle").height();

      h = h - DetailsTitle - topheight;
      // h=h*0.9
      $("#third").css("height", h * 0.85);
      //        $(".index").css("height",h*0.7)
    },
    // showScanPocket:function(){

    // },

    getProductByItemCode: function() {
      // http://10.82.25.197:8081
      let u =
        this.$store.state.runurl +
        "/watsons/rest/gateway/p360/api/getAppointProductByItems";
      let codeList = [];
      for (let i = 0; i < this.pickinglist.length; i++) {
        codeList.push(this.pickinglist[i].skuCode);
      }
      let data = {
        // "storeNo":store.state.storeNum,
        storeNo: this.$store.state.storeNum,

        codeList,
        fieldList: [
          "product_image",
          "product_base",
          "product_comments",
          "store_price",
          "product_ma",
          "product_osd",
          "product_planogram",
          "product_mc",
          "product_med",
          "product_cb",
          "product_property"
        ]
      };
      var that = this;
      this.$axios.post(u, data).then(res => {
        console.log(res);
        if (res.data.is_success) {
          //找到对应的商品，然后显示
          //1.无陈列号    2.有一个陈列号      3有多个陈列号
          // 1. 无就补""    即可
          // 2. 有一个则 赋值到 planogram
          var planogram = [];
          var product_baselist = [];
          //  res.data.data.product_base.product_base
          for (var i = 0; i < res.data.data.product_list.length; i++) {
            planogram.push(res.data.data.product_list[i].product_planogram);
            product_baselist.push(res.data.data.product_list[i].product_base);
            this.$set(this.pickinglist[i], "item", planogram[i].item);
            // this.pickinglist[i].planogram_idarr = []
            //如果product_planogram 数组>1   push进去
            if (
              planogram[i] != "" &&
              planogram[i] != undefined &&
              res.data.data.product_list[i].itemCode ==
                this.pickinglist[i].itemNo
            ) {
              //对比当前列的itemno 和拿到的itemno是否相同
              //无论有多少个
              this.$set(
                this.pickinglist[i],
                "planogram_id",
                planogram[i][0].planogram_id +
                  planogram[i][0].plan_level +
                  planogram[i][0].plan_seq +
                  planogram[i][0].plan_Facing
              );

              // if(planogram[i][0].planogram_id!=null&&planogram[i][0].planogram_id.length>1){
              //   this.pickinglist[i].planogram_idarr.push(planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)

              // }else
              // // ====旧代码=======================
              // if(planogram[i][0].planogram_id!=null&&planogram[i][0].planogram_id.length>0){
              //   this.$set(this.pickinglist[i],"planogram_id", planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)

              // }
              // ============================================================

              if (planogram[i] != null && planogram[i].length > 1) {
                var rearr = [];
                for (var q = 0; q < planogram[i].length; q++) {
                  var re =
                    planogram[i][q].planogram_id +
                    planogram[i][q].plan_level +
                    planogram[i][q].plan_seq +
                    planogram[i][q].plan_Facing;

                  rearr.push(re);

                  $("#forid_" + i).css("display", "inline-block");
                  // forId
                  //                         if(this.pickinglist[i].itemFlag=="D"){
                  //                           $("#forid_"+i).css("display","none");
                  // }else{

                  //   $("#forid_"+i).css("display","inline-block");

                  // }
                }
                this.planogramId.push(rearr);
                var a = this.planogramId;
                console.log("planogramId=======" + a);
              } else {
                this.$set(
                  this.pickinglist[i],
                  "planogram_id",
                  planogram[i][0].planogram_id +
                    planogram[i][0].plan_level +
                    planogram[i][0].plan_seq +
                    planogram[i][0].plan_Facing
                );
                this.planogramId.push(
                  planogram[i][0].planogram_id +
                    planogram[i][0].plan_level +
                    planogram[i][0].plan_seq +
                    planogram[i][0].plan_Facing
                );
              }
            } else {
              this.$set(this.pickinglist[i], "planogram_id", "");
              this.planogramId.push("");
            }

            if (
              product_baselist[i].store_barcode == "" ||
              product_baselist[i].store_barcode == undefined
            ) {
              this.$set(this.pickinglist[i], "store_barcode", "");
            } else {
              this.$set(
                this.pickinglist[i],
                "store_barcode",
                product_baselist[i].store_barcode
              );
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
          layer.msg("货品条码获取不成功，请联系管理员");
        }
      });
    },

    gopicking() {
      var b = false;
      var total = 0;
      console.log("b" + b);
      for (var a = 0; a < this.pickinglist.length; a++) {
        if (this.goodsCount[a] > 0) {
          // if(this.pickinglist[a].returnNum !=this.goodsCount[a]&&this.pickinglist[a].itemFlag!="D"){
          b = true;
          total = parseInt(total) + parseInt(this.goodsCount[a]);
        }
      }
      if (b) {
        // layer.msg("准备拣货")
        var that = this;
        layer.open({
          title: "",
          className: "pickingTips",
          content:
            "当前退货数：" +
            total +
            "件" +
            "/订单总数：" +
            this.goodstotalcount +
            "件,是否确定退货？",
          skin: "demo-class",
          btn: ["确定", "取消"],
          yes: function(index) {
            that.checkreturnGoods();
            layer.close(index);
          }
        });
        that.tipscss();
      } else {
        layer.msg("操作不成功，请检查数量和原因");
      }
    },

    onbl: function(index) {
      this.readypicking = true;
      this.keyboardshow = true;
      var havereason = false;
      var c = this.goodsCount[index];
      for (var a = 0; a < this.pickinglist.length; a++) {
        if (
          ((this.pickinglist[a].reason != undefined) ==
            this.pickinglist[a].reason) ==
          null
        ) {
          havereason = true;
        } else {
          havereason = false;
        }
      }

      if (this.pickinglist[index].orderQty == c && havereason) {
        //颜色变绿色
        //标识完成
        this.$set(this.goodsstateText, index, "完成");
        this.$set(this.goodsstate, index, false);
        this.totakegoods();
      } else if (
        this.pickinglist[index].orderQty < c ||
        this.goodsCount[index] == ""
      ) {
        this.$set(this.goodsCount, index, 0);

        layer.msg("数量有误，请重新输入");
      }
      this.checkAllOrder();
      console.log("this.goodsCount[index]======" + this.goodsCount[index]);
    },

    totakegoods() {
      var topicking = false;
      var that = this;
      layer.open({
        title: "",
        className: "pickingTips",
        content: "您确定退货？",
        skin: "demo-class",
        btn: ["确定", "取消"],
        yes: function(index) {
          // location.reload();
          // that.pickingPocket(that.orderItem.orderNo)
          that.checkreturnGoods();
          layer.close(index);
        }
      });
      that.tipscss();
    },

    checkreturnGoods: function() {
      var returnData = [];
      var key = "";
      console.log("key=======" + key);
      for (var i = 0; i < this.keyarr.length; i++) {
        if (this.reasonTxt == this.reasonlist[i]) {
          key = this.keyarr[i];
          break;
        }
      }
      console.log("key=======" + key);
      for (var i = 0; i < this.pickinglist.length; i++) {
        if (this.goodsCount[i] > 0) {
          var returnItem = {
            itemId: this.pickinglist[i].itemId,
            itemNo: this.pickinglist[i].itemNo,
            type: "1",
            qty: this.goodsCount[i],
            reason: key,
            reasonTxt: this.reasonTxt
          };
          returnData.push(returnItem);
        }
      }
      this.pickingPocket(returnData);
    },

    returnorderchoice(index, returnReason) {
      var or = this.orderlist;
      var id = this.orderlist.id;
      console.log("id=======" + id);
      //  var returnReason = returnReason
      if (returnReason == "退回原因") {
        layer.msg("请选择退回原因");

        return;
      }
      var that = this;
      layer.open({
        title: "",
        className: "pickingTips",
        content: "是否确定操作快递退回？",
        skin: "demo-class",
        btn: ["是的", "取消"],
        yes: function(index) {
          var packState;
          // if(that.packageStateArr){packState=1}else{packState=0}
          // that.packageStateArr
          that.goCancelOrder(id, returnReason, 1); //packageState

          layer.close(index);
        },
        no: function(index) {
          // location.reload();

          layer.close(index);
        }
      });

      this.tipscss();
    },

    goCancelOrder: function(id, returnReason, packState) {
      layer.load(2);
      // http://10.82.25.197:8081
      // var url ="http://10.82.26.249:8888/onstore/admin/order/toTake/takeConfirm";

      var url =
        store.state.runurl + "/onstore/admin/order/express/expressReturn";
      var t = store.state.token;
      var d = {
        id: id,
        returnReason: returnReason,
        packState: packState,
        returnRemark: ""
      };
      $.ajax({
        type: "POST",
        url: url,
        data: d,
        datatype: "json",
        headers: {
          Token: t,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(
        res => {
          layer.closeAll("loading");

          if (res.code == 0) {
            //提示
            layer.open({
              title: "",
              className: "pickingTips",
              content: "操作完成",
              skin: "demo-class",
              btn: ["好的"],
              yes: function(index) {
                Router.push({ name: "ReturnGoodsList" });

                layer.close(index);
              }
            });

            this.tipscss();
            // layer.msg('核销完成');
            store.state.beforeOrderNum = orderNo;
            this.readypicking = false;
          } else if (res.code == 403) {
            var that = this;
            layer.open({
              title: "",
              className: "pickingTips",
              content: "登录已过期，现准备重新登录",
              skin: "demo-class",
              btn: ["好的"],
              yes: function(index) {
                // location.reload();
                Router.push("/");

                layer.close(index);
              }
            });

            that.tipscss();
          } else {
            layer.msg("退货失败，请重试");
          }

          // 提示用户已经拣货完毕，弹出对话框，然后后返回到上一页
        },
        function(res) {
          //失败之后处理逻辑
          //提示无数据
          layer.closeAll("loading");
          layer.msg("退货操作异常，请联系管理员");
        }
      );
    },
    addCount: function(count) {
      this.readypicking = true;
      // this.$set(this.starArr, index, score);
      if (this.pickinglist[count].itemFlag != "D") {
        var c = this.goodsCount[count];
        var picktatal = 0;
        var addordertotalcount = 0;
        var cangopicking = false;
        if (this.pickinglist[count].orderQty == c) {
          layer.msg("货品已够数量");
        } else {
          console.log("=========goodsCount===============" + c);
          c++;
          this.$set(this.goodsCount, count, c);
          if (c > this.pickinglist[count].orderQty) {
            layer.msg("货品已够数量");
          }
          if (this.pickinglist[count].orderQty == c) {
            //颜色变绿色
            //标识完成
            this.$set(this.goodsstateText, count, "完成");
            this.$set(this.goodsstate, count, false);
          }
          console.log("picktatal============" + picktatal);

          this.checkAllOrder();
          if( this.allorderstate){
              layer.open({
          title: "",
          className: "pickingTips",
          content: "全单已检查完，是否提交订单？",
          skin: "demo-class",
          btn: ["确定","取消"],
          yes: (index) =>{
            this.goReturnGoodList()
          },no:(index)=>{
            layer.closeAll()
          }
        });
        this.tipscss();
          }
        }
      }
    },

    checkAllOrder() {
      for (var i = 0; i < this.goodsCount.length; i++) {
        if (
          this.pickinglist[i].itemFlag != "D" &&
          this.goodsCount[i] == this.pickinglist[i].orderQty
        ) {
          this.allorderstate = true;
          // this.goReturnGoodList()
        }
        if (
          this.pickinglist[i].itemFlag != "D" &&
          this.goodsCount[i] != this.pickinglist[i].orderQty
        ) {
          this.allorderstate = false;
          this.allgoodsreturnclass = false;
          return;
        }
      }
    },

    goDown() {
      console.log("==========leave===");
    },

    init() {
      var w = $(window).height();

      var a = $(".orderlist").height();
      var ButtonGroup = $(".ButtonGroup").height();
      var DetailsTitle = $("#DetailsTitle").height();
      var title = $(".title").height();
      a =
        parseInt(w) -
        parseInt(ButtonGroup) -
        parseInt(DetailsTitle) -
        parseInt(title);
      $(".third").css("height", a);
      console.log(" initbackground=========" + a);
      if (
        this.$store.state.phonetype == undefined ||
        this.$store.state.phonetype == "" ||
        this.$store.state.phonetype == null ||
        this.$store.state.phonetype == "urovo" ||
        this.$store.state.phonetype == "TC51" ||
        this.$store.state.phonetype == "UBX" ||
        this.$store.state.phonetype == "DT50"
      ) {
        this.showCamera = false;
      }

      // if (this.$store.state.beforeReturnOrderNum == this.orderNo) {
      //   layer.open({
      //     title: "",
      //     className: "pickingTips",
      //     content: "当前货单已操作，请不要重复操作",
      //     skin: "demo-class",
      //     btn: ["确定"],
      //     yes: function(index) {
      //       this.$router.push({ name: "Message" });
      //       layer.closeAll();
      //     }
      //   });
      //   this.tipscss();
      // }

      if (this.$route.query.rid) {
        this.getOrderDetail(this.$route.query.rid);
      } else {
        layer.msg("当前订单参数获取错误，请联系管理员");
        this.$router.push({ name: "ReturnGoodsListForTmall" });
      }
    },

    // initReasonList() {
    //   if (this.$store.state.returnParam == 2) {
    //     this.keyarr = this.$store.state.expresskeyArr;
    //     this.reasonlist = this.$store.state.expressreasonArr;
    //   } else if (this.$store.state.returnParam == 1) {
    //     this.keyarr = this.$store.state.returnkeyArr;
    //     this.reasonlist = this.$store.state.returnreasonArr;
    //   }
    // },

    cutCount: function(count) {
      var c = this.goodsCount[count];
      console.log("=========goodsCount===============" + c);
      if (c > 0) this.$set(this.goodsCount, count, c - 1);
      this.$set(this.goodsstate, count, true);
      this.$set(this.goodsstateText, count, "待拣货");
      this.checkAllOrder();
    },
    choiceAllGoodsReturn() {
      this.allgoodsreturnclass = !this.allgoodsreturnclass;
      //将当前所有目标数量设置为扫描数量
      if (this.allgoodsreturnclass) {
        var that = this;
        layer.open({
          title: "",
          className: "pickingTips",
          content: "确定全单退货？",
          skin: "demo-class",
          btn: ["确定", "取消"],
          yes: (index) =>{
            this.goodsCountbak = this.goodsCount;
            for (let i = 0; i < this.goodsCount.length; i++) {
              //把this.goodsCount[i] 的qty
              this.goodsCount[i] = this.pickinglist[i].orderQty;
              console.log("this.goodsCount[i]===========" + this.goodsCount[i]);
            }

            this.checkAllOrder();
            if( this.allorderstate){
              this.goReturnGoodList()
            }

            layer.close(index);
          },
          no:(index)=> {
             this.allgoodsreturnclass = !this.allgoodsreturnclass;
            layer.close(index);
          }
        });
        this.tipscss();
      } else {
        // this.goodsCount = this.goodsCountbak
        // this.goodsCountbak  = []
        this.goodsCount = [];
        for (var i = 0; i < this.pickinglist.length; i++) {
          this.goodsCount.push(0);
        }
        this.checkAllOrder();
      }
    }

    // showgoods:function(){
    //  var p =  this.pickinglist
    //   for(var i = 0;i<p.length;i++){
    //     // if(p[i].)
    //   }
    // }
  },

  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      // window.addEventListener('popstate', this.goBack, false);
    }
    // }
    //  store.state.orderItem =  this.orderlist[i]
    this.init();
    this.resetbackground();
   
   
    // this.getAPPDate();
    // this.sendMsg();
    this.initchannelenlist()
    this.initchannelcnlist()
    // this.canshowCount();

    // this.showgoods();
  }
};
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
  border-bottom: 1px solid #efeff4;
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
  color: #8d8d8d !important;
}

.four {
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  background: #42b983;
  font-size: 0.9rem;
  color: #fff;
}

.PocketNum {
  width: 80%;
  margin: 0.5rem auto;
  height: 1.5rem;
  background: #f2f2f2;
  border-radius: 0.3rem;
  border: none;
  display: block;
}
.orderName {
  display: inline-block;
  width: 70%;
  color: #9d9d9d;
  font-size: 0.8rem;
  line-height: 1.3rem;
  overflow: hidden;
  word-break: break-word;
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
}
.goodsordernum,
.goodsmoudle {
  font-weight: 600;
}
.goodsordernum {
  width: 25%;
}

.ordernum {
  float: left;
  padding-left: 1rem;
  font-size: 1.2rem;
}
.price {
  padding-right: 0.5rem;
  float: right;
}
.count {
  width: 3rem;
  border: none;
  margin: 0 0.2rem;
  text-align: center;
}
.channelText {
  color: #ffbd2f;
  margin-left: 1rem;
  padding: 0.1rem 0.3rem;
  margin-bottom: 0.5rem;
  border-radius: 0.2rem;
  border: 1px solid;
  font-size: 0.6rem !important;

}
.orderDate {
  margin-left: auto;
  color: #9d9d9d;
}
#pickbutton {
  background: #42b983;
  color: #fff;
}
.list2{
  display: flex;
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
.totalcount {
}
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
  padding-top: 2.1rem;
  position: absolute;
  right: 0.7rem;
}
.goodlist4point {
  width: 0.4rem;
  display: inline-block;
  transform: rotate(-90deg);
}

.list {
  height: 3rem;
  line-height: 4rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #efeff4;
  width: 90%;
  margin: auto;
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
  color: #ffbd2f;
  font-size: 0.8rem;
}
.okgoodsstate {
  border: none;
  float: right;
  width: 11%;
  padding-right: 1rem;
  padding-top: 0.5rem;
  text-align: right;
  color: #4acc6b;
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
  background: #f7f7f7;
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
  background: #ebf5fd;
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
.placeIcon {
  padding-right: 0.4rem;
  position: relative;
  top: 0.4rem;
}
.list3 div {
  display: inline-block;
}
.list3 {
  color: #9d9d9d;
  padding-left: 0.8rem;
}
.goodsNum {
  width: 30%;
}
.goodstype {
  width: 20%;
  color: #37acd5;
}
.checkstate {
  color: #ffbd2f;
  font-size: 0.9rem;
}
.bookingTime {
  width: 79%;
  color: #3193f7;
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
  padding-right: 0.5rem;
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
  width: 100%;
  height: 3rem;
  box-sizing: border-box;
  line-height: 3rem;
  background: #fae100;
  color: #000;
  text-align: center;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

#DetailsTitle {
  background: #e6e6e6;
  /* padding: 0.5rem; */
}
.title {
  height: 3rem;
  line-height: 1.9rem;
  text-align: center;
  background: #fff;
}
.backPoint {
  width: 4.5%;
  position: absolute;
  left: 1rem;
  top: 1rem;
}
.scanCount {
  font-size: 0.9rem;
  color: #9d9d9d;
}
.searchInput {
  border: none;
  background: #f2f2f2;
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
  border-top: 1px solid #f2f2f2;
  text-align: center;
}
.PocketTitle {
  height: 2.5rem;
  line-height: 2.5rem;
  margin: auto;
}

.packagestate {
  padding-left: 1rem;
  background: #fff;
  height: 2.5rem;
  line-height: 2.5rem;
  border-top: 1px solid #e6e6e6;
}
.allgoods {
  background: url("../../assets/checkboxall.png") center center no-repeat;
  background-size: 1rem auto;
  height: 1rem;
  width: 1.5rem;
  display: inline-block;
  padding-top: 1.4rem;
  margin-right: 0.5rem;
}

.all {
  background: url("../../assets/checkbox.png") center center no-repeat;
  background-size: 1rem auto;
  height: 1rem;
  width: 1.5rem;
  display: inline-block;
  padding-top: 1.4rem;
  margin-right: 0.5rem;
}
.nocheck {
  background: url("../../assets/nocheckbox.png") center center no-repeat;
  background-size: 1rem auto;
  height: 1rem;
  width: 1.5rem;
  display: inline-block;
  padding-top: 1.4rem;
  margin-right: 0.5rem;
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
  background: #efeff4;
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
  background: rgba(0, 0, 0, 0.6);
  /* z-index: 200; */
}
.floatCheckBox {
  float: right;
}
.moreplanogram {
  display: none;
}
.returnBox {
  margin-top: 2.4rem;
}

.spec-menu .spec-menu-box {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 52%;
  background-color: #fff;
  border-top: 1px solid #dadada;
  z-index: 250;
  overflow: auto;
}
.spec-menu .spec-menu-up {
  width: 100%;
  height: 84px;
  position: relative;
  border-bottom: 1px solid #ededed;
}
.spec-menu .spec-menu-middle {
  position: absolute;
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
  border: 1px solid #009e96;
  color: #009e96;
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
  background-color: #009e96;
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
.thirdTitle {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}
</style>
