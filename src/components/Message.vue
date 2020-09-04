<template>
  <div class="index">
    <div id="first">
      <img class="placeIcon" src="../assets/location.png" />
      <span id="storeNum">{{storeNum}}</span>
      <span>{{storeAddress}}</span>

      <div class="clearfix"></div>
    </div>

    <div id="second">
      <div class="secondTitleBox">
        <div id="secondTitle">待处理任务</div>
        <div id="switchPickingBox" @click="switchPickingGoods()" v-if="storecanpickstate">
          <span v-bind:class="[SwitchPickingState==true ? OpenPickingState : ClosedPickingState ]"  ></span>
          <span>{{pickingstateTxt}}</span>
        </div>
      </div>
      <div id="secondContent">
        <div id="count">
          <div id="one" @click="toorderlist()">
            <div class="counts">{{picking}}</div>
            <div class="messagetitle">待拣货</div>
          </div>
          <div id="two" @click="goPickGoods()">
            <div class="counts">{{taking}}</div>
            <div class="messagetitle">C&C待取货</div>
          </div>
          <div id="three">
            <div class="counts">{{returning}}</div>
            <div class="messagetitle">待退回</div>
          </div>

          <div>
            <!-- <span class="countredTips"></span> -->
            <div id="countTips" v-if="timeoutstate">
              共
              <span id="timeoutcount">{{ordercount}}</span>笔订单超时未处理，请尽快处理>>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="backgroundfree"> </div> -->
    <div id="third">
      <div class="list" v-if="pickingstate" @click="toorderlist()">
        <img class="ClickIcon" src="../assets/picking.png" />
        <span class="listcontent">
          <span class="thirdTitle">拣货</span>
          <span class="description clearfix:after">按订单拣货</span>
          <img class="point" src="../assets/point.png" />
          <div class="clearfix"></div>
        </span>
      </div>
      <div class="list"  @click="goPickGoods()">
        <img class="ClickIcon" src="../assets/picking.png" />
        <span class="listcontent">
          <!-- <span class="thirdTitle ">门店提货</span> -->
          <span class="thirdTitle">门店自提</span>

          <span class="description clearfix:after">取货码核销</span>

          <img class="point" src="../assets/point.png" />
          <div class="clearfix"></div>
        </span>
      </div>
      <div class="list"  @click="showselectstate=true">
        <img class="ClickIcon" src="../assets/return.png" />
        <span class="listcontent">
          <span class="thirdTitle">退货&订单取消</span>
          <span class="description clearfix:after">订单取消，退货</span>
          <img class="point" src="../assets/point.png" />
        </span>
      </div>
      <div class="list" v-if="false" @click="goAlreadyPickOrder()">
        <img class="ClickIcon" src="../assets/pickingOrderList.png" />
        <span class="listcontent">
          <span class="thirdTitle">已拣货订单</span>
          <span class="description clearfix:after">订单打印</span>
          <img class="point" src="../assets/point.png" />
        </span>
      </div>
    </div>


    <div v-if="showselectstate" class="spec-menu">
      <div class="spec-menu-box">
        <div class="spec-menu-middle">
          <div class="nature-box">
            <div class="pro-att clear">
              <span class="spec-tit">退货&订单取消:</span>
              <!-- v-for="(dataList,index) in changnnellistCN" -->
              <img class="closeselect" src="../assets/close.png" @click="showselectstate=false" />
            </div>
          </div>
        </div>
        <!-- /规格、属性 -->
        <!-- 按钮 -->
        <div class="returnBox">
          <div id="customreturn" class="list" @click="returnGoods(3)">
            <span class="listcontent">
              <span class="thirdTitle">取消订单</span>
              <img class="point" src="../assets/point.png" />
              <div class="clearfix"></div>
            </span>
          </div>

          <div class="list" @click="returnGoods(2)">
            <span class="listcontent">
              <span class="thirdTitle">快递退回</span>
              <img class="point" src="../assets/point.png" />
              <div class="clearfix"></div>
            </span>
          </div>

          <div class="list" @click="returnGoods(1)">
            <span class="listcontent">
              <span class="thirdTitle">顾客退货</span>
              <img class="point" src="../assets/point.png" />
              <div class="clearfix"></div>
            </span>
          </div>
          <div id="customreturn" class="list" @click="returnGoods(4)">
            <span class="listcontent">
              <span class="thirdTitle">退单入库</span>
              <img class="point" src="../assets/point.png" />
              <div class="clearfix"></div>
            </span>
          </div>
        </div>
        <div class="spec-menu-btn clear">
          <span href="#" class="confirmSelect" @click="choicereason()">确定</span>
        </div>
        <!-- /按钮 -->
      </div>
    </div>
  </div>
</template>

<script>
import Router from "../router/index";
import axios from "axios";
import qs from "qs";
import $ from "jquery";
import store from "../vuex/store";
import { encrypt } from "../../static/toolsjs/Aescrypto";
import md5 from "js-md5";
// import {md5} from '../../static/toolsjs/md5.js'

// import storeList from '../../static/storeList.json';

export default {
  name: "HelloWorld",
  data() {
    return {
      storeAddress: store.state.storeAddress,
      storeNum: store.state.storeNum,
      testprintstore:[],
      picking: 0,
      taking: 0,
      returning: 0,
      canceling: 0,
      timeoutstate: false,
      storedeliverystate: false,
      returnstate: false,
      pickingstate: true,
      ordercount: "5",
      showselectstate: false,
      pageSize: 30,
      pageNum: 1,
      orderNo: "",
      teststore: [],
      SwitchPickingState: false,
      OpenPickingState: "all",
      ClosedPickingState: "nocheck",
      pickingstateTxt: "暂停接单1h",
      timeWait: false, //用于延缓用户频繁调用接单
      storecanpickstate:false
    };
  },
  methods: {
    initprintstate(){

      let s = "../static/printstoreList.json";
    if (store.state.env == "0") {
      s = "../../KMS/static/printstoreList.json";
    }
    axios.get(s).then(
      res => {
        this.testprintstore = res.data;
        if(this.testprintstore.length>0){
          this.testprintstore.forEach((data) => {
            if(store.state.storeNum == data){
              store.state.canprintType = true
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
    init(){
      let u = "../static/storeList.json";
    if (store.state.env == "0") {
      u = "../../KMS/static/storeList.json";
    }
    axios.get(u).then(
      response => {
        console.log(response.data);
        this.teststore = response.data;
        this.checkteststore();
      },
      response => {
        console.log("error");
        layer.msg("测试店铺信息获取失败，请联系管理员");
      }
    );


    },
    goAlreadyPickOrder(){
      Router.push({ name: "AlreadyPickOrderList" });
    },
    switchPickingGoods() {
      if (this.SwitchPickingState) {
        this.GOSwitchPicking("0");
      } else {
        this.GOSwitchPicking("4");
      }

      //  this.SwitchPickingState = !this.SwitchPickingState;
    },
    getNowDate(more) {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let H = date.getHours();
      if (more) {
        H += 1;
      }
      let mm = date.getMinutes();
      let s = date.getSeconds();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      H = H < 10 ? "0" + H : H;
      return y + "-" + m + "-" + d + " " + H + ":" + mm + ":" + s;
    },
    GOSwitchPicking(storeShutout) {
      let curTime = this.getNowDate(false);
      let nextHourCurTime;
      let BeginTime;

      if (storeShutout == "0") {
        BeginTime = "";
        nextHourCurTime = "";
      } else {
        BeginTime = curTime;
        nextHourCurTime = this.getNowDate(true);
      }

      let datajson = {
        propertyMap: {
          storeShutout: storeShutout,
          storeShutoutBeginTime: BeginTime,
          storeShutoutEndTime: nextHourCurTime
        },
        storeNo: this.storeNum
      };
      datajson = JSON.stringify(datajson);
      let paramString = "Pocket" + "986209" + datajson + curTime;
      let t1 = md5(paramString).toUpperCase();
      // console.log("paramString========="+t1)
      var t2 = t1 + "aCgcm09Z";
      // var result = md5(tmp2).toUpperCase();
      let sign = md5(t2).toUpperCase();
      console.log("sign======================" + sign);

      let p = {
        appId: "Pocket",
        certiId: "986209",
        date: curTime,
        sign: sign,
        data: {
          propertyMap: {
            storeShutout: storeShutout,
            storeShutoutBeginTime: BeginTime,
            storeShutoutEndTime: nextHourCurTime
          },
          storeNo: this.storeNum
        }
      };

      let u = `${store.state.runurl}/store/api/saveStorePropertyValue`;
      if(this.$store.state.env==1){
         u = `${store.state.runurl}/store/api/saveStorePropertyValue`;

      }
      axios.post(u, p).then(
        res => {
          layer.closeAll("loading");
          if (res.data.success != true) {
            // this.SwitchPickingState = false;
            layer.msg("店铺拣货状态有问题，请重新登录操作");
          } else {
            this.initDataPickingState();
          }
        },
        function(res) {
          layer.closeAll("loading");
          layer.msg("店铺拣货状态有问题，请重新登录");
        }
      );
    },
    initDataPickingState() {
      let u = `${store.state.runurl}/api/findStoreInfo`;
      if(this.$store.state.env==1){
         u = `${store.state.runurl}/store/api/findStoreInfo`;

      }
      // let file = e.target.files[0]
      let param = new FormData(); // 创建form对象
      param.append("storeNo", this.storeNum);
      let head = {
        "Content-Type": "application/x-www-form-urlencoded"
      };

      axios.post(u, param, head).then(
        res => {
          if (res.data.data.property.storeShutout == 0) {
            this.SwitchPickingState = false;
          } else if (res.data.data.property.storeShutout == 4) {
            this.SwitchPickingState = true;
          }  else if (res.data.data.property.storeShutout == 2) {
            this.SwitchPickingState = true;
            layer.msg("店铺状态为装修中...");
          } else {
            layer.msg("店铺拣货状态异常，请重新登录");
          }
        },
        function(res) {
          layer.closeAll("loading");
          layer.msg("店铺拣货状态有问题，请重新登录");
        }
      );
    },
    setbackground() {
      var w = $(window).height();
      console.log("w===old======" + w);
      $(".index").css("height", w);
    },
    goPickGoods() {
      Router.push({ name: "PickOrderList" });
    },
    returnGoods(i) {
      store.state.returnParam = i;  
      if(i!=4){
        Router.push({ name: "ReturnGoodsList" });
      }else{
        Router.push({ name: "ReturnGoodsListForTmall" });

      }
    },
    tipscss() {
      $(".layui-layer-btn1").css("border", "none");
      $(".layui-layer-btn0").css("border", "none");
      $(".layui-layer-btn0").css("border", "none");
      $(".layui-layer-btn0").css("background", "#009E96");
      $(".layui-layer-close2").css("display", "none");
    },
    getpickdata: function() {
      // layer.load(2);
      var url =
        store.state.runurl +
        "/watsons/rest/gateway/kms/onstore/admin/common/order/pickList?pageNum=1&pageSize=1&unavailable=0";
      var t = store.state.token;
      $.ajax({
        type: "get",
        url: url,
        datatype: "json",
        headers: {
          Token: t,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(
        res => {
          layer.closeAll("loading");
          if (res.code == "0" && res.data != null && res.data.list.length > 0) {
            this.picking = res.data.total;
            store.state.totalCount = res.data.total;
            this.storeAddress = res.data.list[0].storeName;
            this.storeNum = res.data.list[0].storeNo;
            store.state.storeNum = res.data.list[0].storeNo;
            this.gettimeoutdata();
            this.setbackground();
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
            layer.closeAll("loading");
            // layer.msg("数据出错，请联系管理员");
          }
        },
        function(res) {
          layer.closeAll("loading");
          layer.msg("数据出错，请联系管理员");
        }
      );
    },

    getcncReturnCount: function() {
      var that = this;
      // layer.load(2);
      var url =
        store.state.runurl +
        "/onstore/admin/common/order/expressReturnCount"
      var t = store.state.token;
      $.ajax({
        type: "post",
        url: url,
        data:{"storeNo":store.state.storeNum},
        datatype: "json",
        headers: {
          Token: t,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(
        res => {
          layer.closeAll("loading");

          if (res.code == "0" && res.data > 0) {
            // this.timeoutstatetimeoutstate = true
            this.returning = res.data;
          }

          console.log("cncTakeCount======" + res);
        },
        function(res) {
          // layer.closeAll('loading')
          layer.msg("待退回数据有问题，请联系管理员");
        }
      );
    },

    getcncTakeCount: function() {
      var that = this;
      // layer.load(2);
      var url =
        store.state.runurl +
        "/watsons/rest/gateway/kms/onstore/admin/common/order/cncTakeCount";
      var t = store.state.token;
      $.ajax({
        type: "post",
        url: url,
        data:{"storeNo":store.state.storeNum},
        datatype: "json",
        headers: {
          Token: t,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(
        res => {
          layer.closeAll("loading");

          if (res.code == "0" && res.data > 0) {
            // this.timeoutstate = true
            this.taking = res.data;
          }

          console.log("cncTakeCount======" + res);
        },
        function(res) {
          // layer.closeAll('loading')
          layer.msg("数据出错，请联系管理员");
        }
      );
    },
    checkteststore() {
      //根据店铺号判断是否允许show phase 2 的功能
      if (this.teststore.length > 0) {
        for (let i = 0; i < this.teststore.length; i++) {
          if (this.teststore[i] == store.state.storeNum) {
            this.storecanpickstate = true;
          }
        }
      }
      this.storedeliverystate = true;
      this.returnstate = true;
      this.getcncTakeCount();
      this.getcncReturnCount();
      // }
    },

    gettimeoutdata: function() {
      var that = this;
      var url =
        store.state.runurl +
        "/watsons/rest/gateway/kms/onstore/admin/common/order/timeoutPickCount";
      var t = store.state.token;
      $.ajax({
        type: "post",
        url: url,
        data:{"storeNo": store.state.storeNum},
        datatype: "json",
        headers: {
          Token: t,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(
        res => {
          layer.closeAll("loading");

          if (res.code == "0" && res.data > 0) {
            this.timeoutstate = true;
            this.ordercount = res.data;
          }

          console.log("res======" + res);
        },
        function(res) {
          // layer.closeAll('loading')
          layer.msg("数据出错，请联系管理员");
        }
      );
    },

    toorderlist() {
      var st = store.state.storeNum;
      if (store.state.storeNum != "" && store.state.storeNum != null) {
        Router.push({ name: "OrderList" });
      } else {
        layer.msg("数据出错，请联系管理员");
      }
    },
    toNext() {
      console.log("OrderList======================");
      Router.push({ name: "OrderList" });
    }
  },
  computed: {},
  mounted() {
    this.timeoutstate = false;
    this.setbackground();
    this.getpickdata();
    this.initDataPickingState();
    this.checkteststore();
    this.initprintstate()
    this.init()
    // console.log("loadFile=="+storeList)
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

.thirdTitle {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.description {
  right: 1rem;
  top: 0.6rem;
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

.index {
  background: #efeff4;
}

.backgroundfree {
  height: 1rem;
  background: #efeff4;
  width: 100%;
}

#storeNum {
  padding-right: 0.5rem;
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
  width: 1.5rem;
  position: relative;
  top: 0.3rem;
}

#third {
  background: #fff;
  font-size: 2rem;
}

#secondContent {
  background: #efeff4;
}

#secondTitle {
  font-weight: 600;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  /* font-size: 1.1rem; */
}

#second {
  margin: 1rem 0 1rem 0;
}

.countredTips {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: #ec7259;
  border-radius: 1rem;
}

.counts {
  padding-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
}

#count {
  width: 96%;
  /* text-align: center; */
  border-radius: 1rem;
  margin: auto;
  background: #4aa1fa;
  border-radius: 0.6rem;
  padding: 1rem 0;
  color: #fff;
}

.listcontent {
  height: 3.4rem;
}

#one,
#two,
#three {
  display: inline-block;
  width: 32%;
  text-align: center;
  box-sizing: border-box;
}

#first {
  background: #fff;
  font-size: 0.9rem;
  height: 2rem;
  padding-top: 1rem;
  padding-left: 1rem;
}

.placeIcon {
  width: 1rem;
  height: 1rem;
  padding-right: 1rem;
}

#countTips {
  height: 3rem;
  line-height: 4rem;
  display: inline-block;
  font-size: 0.8rem;
  color: #ec7259;
  padding-left: 2rem;
}

.clearfix:after {
  content: "020";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.messagetitle {
  color: #9bd4fd;
}

#timeoutcount {
  padding: 0 0.5rem;
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

.returnBox {
  /* margin-top: 3rem; */
  overflow: auto;
}

.spec-menu .spec-menu-box {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 55%;
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
  /* position: absolute;
    bottom: 43px;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 10px;
    overflow: auto; */
  padding-left: 1rem;
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
  display: none;
  height: 44px;
  width: 100%;
  font-size: 14px;
  line-height: 44px;
  color: #fff;
  text-align: center;
  float: left;
}

.closeselect {
  display: inline-block;
  margin-top: 0.2rem;
  float: right;
  width: 1.7rem;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
#switchPickingBox {
  margin-left: auto;
  padding-right: 0.5rem;
}

.secondTitleBox {
  display: flex;
}

/* 选择框 */
.all {
  background: url("../assets/checkbox.png") center center no-repeat;
  background-size: 1rem auto;
  height: 1rem;
  width: 1rem;
  display: inline-block;
}
.nocheck {
  background: url("../assets/ClosePickingState.png") center center no-repeat;
  background-size: 1rem auto;
  height: 1rem;
  width: 1rem;
  display: inline-block;
}
</style>