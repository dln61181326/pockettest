<template>
  <div class="index">
    <div class="layui-form-item unaTips" id="TicketTips">
      <div class="tipsBoxTitle">
        多单拣货操作提示
      </div>

      <div class="tipsBoxContent">以下订单正在操作，需操作人先解锁</div>

      <div class="lockorderbox">
        <div v-for="(lockorderlist,index) in mullockorderlist" @click="selectprintorder(index)">

          <div  class="lockorderlist">单号:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{lockorderlist.orderNo}}</div>
          <div  class="lockorderlist">锁定人: {{lockorderlist.lockUser}} </div>
        </div>
      </div>
      <!-- <div class="underline"></div> -->
    </div>
    <nav class="navbar navbar-inverse navbar-fixed-top top">
      <loadding v-if="showstate"></loadding>

      <div class="title">
        <img class="backPoint clearfix:after" src="../assets/backPoint.png" @click="toMessage()">
        <div class="titlename">拣货</div>
        <div class="clearfix"></div>
      </div>
      <!--  class="navbar navbar-inverse navbar-fixed-top"  -->
      <div id="searchBox">
        <img class="codeIcon" src="../assets/noglasses.png">
        <input class="searchInput" type="text" v-model="dn" @keyup.enter="searchpickdata(dn,false)"
          v-on:blur="resetbackground()" placeholder="支持输入或扫描订单号">
        <img class="camera" @click="showcamerascan()" v-if="showCamera" src="../assets/cameraIcon.png">

        <div class="searchButton" @click="getpickdata(dn,false)">搜索</div>
        <div class="clearfix"></div>

      </div>
      <div id="" class="searchKey">
        <div id="channel">
          <!-- <span @click="channelSearch">全部渠道</span> -->
          <span @click="channelSearch">{{channneltitle}}</span>

          <img id="channelImg" class="channelImg" src="../assets/backPoint.png">
          <span v-if="gettotalCountstate()" class="totalCount"><span class="pickingtotal">{{totalCount}}</span></span>
          <!-- <div class="clearfix"></div> -->

        </div>
        <div id="searchOrderType">
          <!-- <span @click="channelSearch">全部订单类型</span> -->
          <span @click="SearchKeyStateChange">{{orderlistSearchKey}}</span>

          <img id="searchkeystateImg" class="channelImg " src="../assets/backPoint.png">

        </div>
        <div v-if="canMultipleChoiceState" v-bind:class="[MultipleChoiceState ==true ? unfunctiontype : functiontype ]"
          @click="MultipleChoiceStateShow()">
          <div>
            多单拣货
          </div>

          <div v-bind:class="[MultipleChoiceState==true ? choosechannel : unchoosechannel ]"></div>
        </div>
        <img class=" orderby" src="../assets/orderby.png" @click="dataorderbysort()">

      </div>
    </nav>
    <div id="second">
      <div class="searchlist" v-if="searchstate">
        <!-- 渠道列表 -->
        <div class="maskBoxblack TipsMask" v-if="searchstate">
          <span class="TipsBox maskBox">
            <div class="searchFixedList">
              <div class="searchlistcheckBox" :id="checkBoxId(index)" v-for="(dataList,index) in changnnellistCN"
                @click="choice(index)">
                <span v-bind:class="[channelArr[index]==true ? choosechannel : unchoosechannel ]"
                  @click="Selectchanne(index)">
                </span>
                {{dataList}}

              </div>


            </div>
            <div class="searchlistButton ">
              <span @click="channelSearchOK(index)">确定</span>

            </div>

          </span>
        </div>
      </div>

      <div class="searchlist" v-if="searchkeystate">
        <!-- 订单类型 -->
        <div class="maskBoxblack TipsMask" v-if="searchkeystate">
          <span class="TipsBox maskBox">
            <div class="searchFixedList">
              <div class="searchlistcheckBox" :id="checkBoxId(index)" v-for="(dataList,index) in ordertypeList"
                @click="Selectordertype(index)">
                <span v-bind:class="[ordertypeArr[index]==true ? choosechannel : unchoosechannel ]">
                </span>
                {{dataList}}

              </div>


            </div>
            <div class="searchlistButton ">
              <span @click="OrderTypeSearchOK(index)">确定</span>

            </div>

          </span>
        </div>
      </div>
    </div>


    <div id="third">
      <div v-if="datasiNull" class="datatips">无相关数据</div>

      <div class="orderlist">
        <div class="orderlistBox" v-for="(dataList,index) in orderlist">
          <div v-if="MultipleChoiceState"
            v-bind:class="[MultipleChoiceArr[index]==true ? Multiplechoose : MultipleUnchoose ]"
            @click="SelectMultiplehoiceOrder(index)"></div>




          <div class="orderlistContent" @click="toDetail(index)">
            <div class="list1">
              <div class="ordernum">{{dataList.orderNo}}</div>
              <div class="right">
                <div class="count">数量:{{dataList.orderItem.length}}</div>

                <div class="price clearfix:after">￥{{dataList.orderAmt}}</div>
              </div>
              <!-- <div class="clearfix"></div> -->

            </div>
            <div class="list1">
              <div class="channelTextDiv">
                <div class="channelText">
                  {{dataList.channelCodeCN==undefined?"未知渠道":dataList.channelCodeCN}}
                </div>
              </div>
              <div class="orderDate price clearfix:after">{{dataList.orderDate}}</div>
            </div>

          </div>
        </div>

        <div v-bind:class="[MultipleChoiceState ==true ? getmoredatapadding : getmoredataunpadding ]"
          v-if="loadmorestate" @click="getmoredata()">加载更多</div>
        <div v-bind:class="[MultipleChoiceState ==true ? getmoredatapadding : getmoredataunpadding ] " class="nodata"
          v-if="havenodatastate">已经无数据了....</div>

      </div>


    </div>

    <div class="multipechoiceorderbox" v-if="MultipleChoiceState">
      <div class="multipechoiceorderBtn" @click="beginMultiplePicking()">
        开始多单拣货
      </div>
    </div>

  </div>
  </div>

</template>

<script>
  import $ from 'jquery'
  import Router from "../router/index";
  import store from '../vuex/store';
  import loaddingVue from './loadding';
  import axios from 'axios';

  export default {
    name: 'HelloWorld',
    components: { //引用重复页面模块
      loadding: loaddingVue,
    },
    data() {
      return {
        windowheight: "",
        datasiNull: false,
        page: 1,
        choosechannel: 'all',
        unchoosechannel: 'nocheck',
        unfunctiontype: "unfunctiontype",
        functiontype: "functiontype",
        pagenum: 1,
        Selectchannel: "全部",
        channneltitle: "全部渠道",
        orderlistSearchKey: "订单类型",
        dataorderbystate: store.state.sort,
        searchstate: false,
        searchkeystate: false,
        channelCode: "",
        dataisnull: false,
        channelArr: [],
        ordertypeArr: [],
        showCamera: true,
        totalCountstate: false,
        totalCount: "",
        dn: "",
        msg: "",
        loadmorestate: false,
        loadmorekepp: 1,
        havenodatastate: false,
        showstate: false,
        nodatastate: false,
        // orderlistdata:[],
        orderlist: [],
        orderlistdata: [],
        ordertypesearchkey: ["", "CNC", "CND", "CNDT"],
        ordertypeList: ["全部订单", '门店速提', '闪电送', '同城配'],
        changnnellist: ["", "WS", "WS_MT", "WS_ELM", "TM", "JD", "JDDJ_MZ", "JDDJ_YD", "VM", "7LK", "JK", "BASTORE",
          "PZ", "ZCS_TB", "MYSTORE",'TM_SM'
        ],
        changnnellistCN: ["全部", "莴笋自营", "莴笋美团", "莴笋饿了么", "天猫商城", "京东商城", "京东到家美妆", "京东到家药店", "自动售货机", "七乐康平台", "平安好医生",
          "云店", "积分商城", "试用瓶", "云店2.0","天猫超市"
        ],
        getmoredatapadding: 'getmoredatapadding',
        getmoredataunpadding: 'getmoredataunpadding',
        //  多单拣货变量
        MultipleChoiceState: false,
        MultipleChoiceStateList: [], //把用户点击选择的订单保存
        MultipleChoiceArr: [], //记录用户点击了哪个
        MultipleUnchoose: "nocheck",
        Multiplechoose: "all",
        mullockorderlist: [],
        teststore:[],
        canMultipleChoiceState:false
      }
    },

    methods: {
      initprintstate(){

let s = "../static/mulpickinglist/mulpickinglist.json";
if (store.state.env == "0") {
s = "../../KMS/static/mulpickinglist/mulpickinglist.json";
}
    axios.get(s).then(
      response => {
        console.log(response.data);
        this.teststore = response.data;
        let result = this.teststore.find((value, index, arr) => {
              return value == this.$store.state.storeNum
            })
            if(result){
              this.canMultipleChoiceState = true
            }
      },
      response => {
        console.log("error");
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
      },
      beginMultiplePicking() {
        let lockarr = []
        let canlockorder = true
        this.MultipleChoiceStateList.forEach((item, i) => {
          //判断当前单是否有
          // item.lockState == 1? canlockorder = false: 
          if (item.lockState == 1&&item.lockUser!=this.$store.state.cempno) {
          // if (true) {
             canlockorder = false
            this.mullockorderlist.push(item)
          } else {

            lockarr.push(this.sendlockList(item.orderNo, i))
          }
        });
        if (!canlockorder) {
          //弹出提示
          //显示layer，提示选择是否打印
          layer.open({
            title: "",
            className: 'pickingTips',
            type: 1,
            content: $('#TicketTips'),
            skin: "demo-class",
            btn: ['确定'],
            yes: (index) => {
              this.mullockorderlist = []
              layer.close(index);
            },
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
          return
        }
        Promise.all(lockarr).then((result) => {
          if (result[0].code == 0) {
            if (this.MultipleChoiceStateList.length > 1) {
              this.$router.MultipleItemList = [],
                this.$router.sumItemList = [],
                this.$router.pickitemlist = [],
                this.$router.allItemList = [],
                this.$router.push({
                  path: "MultipleOrderList",
                  query: {
                    pickinglist: this.MultipleChoiceStateList

                  }
                })
            } else {
              layer.msg('批量拣货必须选多张单')
            }
          } else {
            layer.msg('锁单失败，请重试')
          }
        }).catch((error) => {
          console.log(error) // 失败了，打出 '失败'
          layer.msg('锁单失败，请重试')
        })

      },
      MultipleChoiceStateShow(i) {
        this.MultipleChoiceState = !this.MultipleChoiceState

      },
      SelectMultiplehoiceOrder(i) {

        if (this.MultipleChoiceArr[i]) { //检查当前位置的订单选项是否是高亮
          this.$set(this.MultipleChoiceArr, i, !this.MultipleChoiceArr[i]); //取消
          // this.MultipleChoiceArr.$remove(this.MultipleChoiceStateList[i])
          this.MultipleChoiceStateList.splice(this.MultipleChoiceStateList[i], 1)


        } else {

          if (this.MultipleChoiceStateList.length <= 5) {
            this.MultipleChoiceStateList.push(this.orderlist[i])
            this.$set(this.MultipleChoiceArr, i, !this.MultipleChoiceArr[i]); //取消

          } else {
            layer.msg("已超出篮子数量")
          }
        }

      },
      initMultipChoiceArr() {
        for (let v = 0; v < this.orderlist.length; v++) {
          this.MultipleChoiceArr.push(false)
        }
      },
      handleScroll(e) {
        var viewHeight = $("#third").height(); //可见高度  

        var contentHeight = $("#third").get(0).scrollHeight; //内容高度  

        var scrollHeight = $("#third").scrollTop(); //滚动高度  

        if (contentHeight - viewHeight < scrollHeight) {

          this.getmoredata()

        }
      },
      checkBoxId(i) {
        return "checkBox"
        // return "checkBox"+i

      },

      Selectordertype(i) {
        // console.log("orderlistSearchKey========"+this.ordertypeList[i])
        // if(i!=undefined&&i!=""){

        this.orderlistSearchKey = this.ordertypeList[i]
        // }

        for (var a = 0; a < this.ordertypeArr.length; a++) {
          if (i == a) {
            this.$set(this.ordertypeArr, i, true);
            // this.channneltitle = this.changnnellistCN[i]
          } else {
            this.$set(this.ordertypeArr, a, false);
          }

        }

      },

      Selectchanne(i) {
        // console.log("index========"+i)
        if (i != undefined && i != "")
          this.Selectchannel = this.changnnellistCN[i]
      },
      goback() {
        Router.push("Message")
      },
      showcamerascan() {
        var phoneType = window.sessionStorage.phoneType
        let msg = this.msg
        if (phoneType == "android") {
          this.$bridge.callHandler('scanCodeCall', msg, (res) => { //安卓扫一扫功能
          })
        } else {
          this.$bridge.callHandler('callScan', msg, (res) => { //苹果扫一扫功能
            // 处理返回数据
          })
          // this.IOSgetScanCode()
        }
      },


      getAPPDate() {
        var that = this

        this.$bridge.registerHandler('scanResult', (data, responseCallback) => { //苹果扫一扫功能
          alert("data===" + data)
          if (data != "") {
            that.dn = ""
            that.dn = data
            that.getpickdata(that.dn, false)
          }

          responseCallback(data)
        })
        this.$bridge.registerHandler('scanCallback', (data, responseCallback) => { //安卓扫一扫功能

          if (data != "") {
            that.dn = ""
            that.dn = data
            // that.getpickdata(that.dn,false)
          }

          responseCallback(data)
        })

        this.$bridge.registerHandler('redScanCodeCall', (data, responseCallback) => {

          if (data != "") {
            this.dn = ""
            this.dn = data
            this.getpickdata(this.dn, false)
          }
          responseCallback(data)
        })
      },

      toMessage() {
        Router.push("/Message")
      },
      sendMsg() {
        let msg = this.msg
        var that = this
        console.log("getAPPDate================")
        if (store.state.phonetype == "urovo" || store.state.phonetype == "TC51" || store.state.phonetype == "UBX" ||
          store.state.phonetype == "DT50") {

          this.$bridge.callHandler('redScanCodeCall', msg, (res) => {})
        } else if (store.state.phoneType == undefined || store.state.phoneType == "") {
          this.$bridge.callHandler('redScanCodeCall', msg, (res) => {
            // alert('获取app响应数据:'+res)
            this.test = res
          })
        }

        
        // alert('获取app响应数据:'+res)
        let Imgmsg =[{
                "filename": 'watsonslogo.png',
                "url": 'http://10.82.96.75:8080/static/img/watsonslogo.png',
              },
              {"filename": 'noreason.png',
                "url": 'http://10.82.96.75:8080/static/img/noreason.png',
              },
              {"filename": 'tmall.png',
                "url": 'http://10.82.96.75:8080/static/img/tmall.png',
              },
              
              ]
        // Imgmsg[0].url = store.state.runurl.indexOf(75) !=-1? store.state.runurl+'/KMS/static/img/' : store.state.runurl+'/static/img/'

        // Imgmsg[0].url = store.state.runurl.indexOf(75) !=-1? 'aaa' :'imf'
      console.log('Imgmsg',Imgmsg)
        this.$bridge.callHandler('InitImg', Imgmsg, (res) => {

        })

      },

      searchpickdata() {
        this.orderlist = []
        this.getpickdata(this.dn, false)
      },

      channelSearchOK(i) {
        this.channelSearch()
        this.orderlist = []
        this.getpickdata(this.dn, false)
      },

      OrderTypeSearchOK(i) {
        this.SearchKeyStateChange()
        this.orderlist = []
        this.getpickdata(this.dn, false)
      },

      ordertypeSearch(index) {
        this.SearchKeyStateChange()
        this.orderlist = []

        this.getpickdata(this.dn, false)
      },

      init() {
        layer.closeAll('tips'); //关闭所有的tips层     

        this.dn = store.state.phoneType
        if (store.state.phonetype == undefined || store.state.phonetype == "" || store.state.phonetype == null || store
          .state.phonetype == "urovo" || store.state.phonetype == "TC51" || store.state.phonetype == "UBX" || store
          .state.phonetype == "DT50") {
          this.showCamera = false
        }
        this.Selectchanne(store.state.inde)
        // },

      },

      // 降序排列
      down(name) {
        return function (obj1, obj2) {
          let val1 = obj1[name]
          let val2 = obj2[name]
          val1 = val1.replace(/-/g, '/')
          val2 = val2.replace(/-/g, '/')
          var time1 = new Date(val1).getTime()
          var time2 = new Date(val2).getTime()
          return time2 - time1
        }
      },
      // 升序排列
      dataorderbysort() {
        // this.orderlist.reverse();
        //  console.log("orderDate======")
        if (this.dataorderbystate) {
          this.orderlist.sort(this.up('orderDate'))
        } else {
          this.orderlist.sort(this.down('orderDate'))

        }
        this.dataorderbystate = !this.dataorderbystate
        // var sortdata = this.orderlist

      },
      up(name) {
        return function (obj1, obj2) {
          let val1 = obj1[name]
          let val2 = obj2[name]
          val1 = val1.replace(/-/g, '/')
          val2 = val2.replace(/-/g, '/')
          var time1 = new Date(val1).getTime()
          var time2 = new Date(val2).getTime()
          var result = time1 - time2
          return result
        }
      },

      initchannelchoice() {
        console.log(" initchannelchoice=========")
        this.initchannelcnlist()
        this.initchannelenlist()

        for (var a = 0; a < this.changnnellistCN.length; a++) {
          if (a == 0) {
            this.channelArr.push(true)
          } else {

            this.channelArr.push(false)
          }
        }

        for (var a = 0; a < this.ordertypeList.length; a++) {
          if (a == 0) {
            this.ordertypeArr.push(true)
          } else {

            this.ordertypeArr.push(false)
          }
        }
      },

      getmoredata() {
        this.pagenum = this.pagenum + 1
        this.getpickdata(this.dn, true);


      },


      // this.recommendlist.sort(this.compare(type));
      notdatasetbackground() {
        var h = $(window).height()
        var bottomheight = $(".bottom").height()
        h = h
        $(".orderlist").css("height", h)
        $("#third").css("background", "#F2F2F2");

        this.orderlist = []
        this.loadmorestate = false;
        this.havenodatastate = true
        this.loadmorekepp = false

      },



      sendlockList: function (orderNo, i) {
        layer.load(2);
        return new Promise((resolve, reject) => {
          var url = store.state.runurl + "/watsons/rest/gateway/kms/onstore/admin/common/order/lockPick";
          var t = store.state.token
          var formData = new FormData();
          formData.append("orderNo", orderNo)
          var data = {
            "orderNo": orderNo,

          };
          $.ajax({
              type: 'post',
              data: {
                orderNo: orderNo
              },
              url: url,
              datatype: "json",
              headers: {
                "Token": store.state.token,
                'Content-Type': 'application/x-www-form-urlencoded'


              },
              success: (res) => {
                layer.closeAll('loading')
                resolve(res)
                if (res != null && res.code == 0) {
                  store.state.orderItem = this.orderlist[i]
                  store.state.channelArr = this.orderlist[i].channelCode
                  store.state.channelCodeCN = this.orderlist[i].channelCodeCN
                  store.state.sort = this.dataorderbystate
                  console.log("this.dataorderbystate=======================" + this.dataorderbystate)
                  if (!this.MultipleChoiceState) {

                    Router.push("Details")
                  }
                } else if (res != null && res.code == 500) {
                  layer.msg(res.msg);
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
                  layer.msg('打开订单失败，请重试');
                }
              },
              error: err => {
                reject(err); // 请求失败则转成Promise对象并判断为reject状态
              }
            }

            // ).then((res) => {

            //   layer.closeAll('loading')
            //   // console.log("res-----------------"+res)
            //   if (res != null && res.code == 0) {
            //     store.state.orderItem = this.orderlist[i]
            //     store.state.channelArr = this.orderlist[i].channelCode
            //     store.state.channelCodeCN = this.orderlist[i].channelCodeCN
            //     store.state.sort = this.dataorderbystate
            //     console.log("this.dataorderbystate=======================" + this.dataorderbystate)
            //     Router.push("Details")
            //   } else if (res != null && res.code == 500) {
            //     layer.msg(res.msg);
            //   } else if (res.code == 403) {
            //     var that = this
            //     layer.open({
            //       title: '',
            //       className: 'pickingTips',
            //       content: '登录已过期，现准备重新登录',
            //       skin: "demo-class",
            //       btn: ['好的'],
            //       yes: function (index) {
            //         // location.reload();
            //         Router.push("/")

            //         layer.close(index);
            //       }
            //     });

            //     that.tipscss()
            //   } else {
            //     layer.msg('打开订单失败，请重试');
            //   }
            // }, function (res) {
            //   //失败之后处理逻辑
            //   //loadding取消
            //   //提示订单异常，请联系管理员

            //   layer.closeAll('loading')
            //   layer.msg('订单异常，请联系管理员');
            // }
          )
        })
      },
      toDetail: function (i) {
        // 锁定状态（0：未锁，1：已锁）

        if(this.MultipleChoiceState){
          return
        }


        if (this.orderlist[i].lockState == "" || this.orderlist[i].lockState == 0) {
          this.sendlockList(this.orderlist[i].orderNo, i)
        } else {
          this.unlockList(this.orderlist[i].orderNo, store.state.cempno, i)

        }
        // store.state.orderItem =  this.orderlist[i]
        //         Router.push("Details")



      },
      unlockList: function (orderNo, lockId, i) {
        layer.load(2);

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
          layer.closeAll('loading')
          if (res != null && res != "" && res.code != null && res.code == "0") {
            store.state.orderItem = this.orderlist[i]
            this.sendlockList(this.orderlist[i].orderNo, i)
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
          layer.msg('打开订单失败，请重试');

        })
      },

      choice (index) {
        for (let a = 0; a <= this.changnnellistCN.length; a++) {
          console.log('index---',index)
          if (index == a) {
            this.$set(this.channelArr, index, true);
            this.channneltitle = this.changnnellistCN[index]
          } else {
            this.$set(this.channelArr, a, false);
          }

        }

      },


      initbackground: function () {
        this.windowheight = $(window).height()
        $(".index").css("height", this.windowheight)
        console.log(" initbackground=========")
      },
      resetbackground: function () {
        var top = $(".top").height()
        var w = this.windowheight
        w = w - top
        $("#third").css("height", w * 0.98)

        // $("html, body").animate({
        // scrollTop: 0 }, {duration: 0,easing: "swing"});
        // this.initbackground()
        // }


      },
      gettotalCountstate() {
        if (store.state.totalCount > 0) {
          return true
        } else {
          return false
        }
      },

      channelSearch: function () {
        if (this.searchstate) {
          $("#channelImg").css("transform", "rotate(-90deg)")
        } else {
          $("#channelImg").css("transform", "rotate(90deg)")
          $("#searchkeystateImg").css("transform", "rotate(-90deg)")
          this.searchkeystate = false

        }
        this.searchstate = !this.searchstate

      },
      SearchKeyStateChange: function () {
        if (this.searchkeystate) {
          $("#searchkeystateImg").css("transform", "rotate(-90deg)")

        } else {
          $("#searchkeystateImg").css("transform", "rotate(90deg)")
          $("#channelImg").css("transform", "rotate(-90deg)")
          this.searchstate = false

        }

        this.searchkeystate = !this.searchkeystate

        //
        //  $(".searchlistcheckBox").hide()

        //  console.log("==checkBox18============")


      },

      tipscss() {
        $(".layui-layer-btn1").css("border", "none")
        $(".layui-layer-btn0").css("border", "none")
        $(".layui-layer-btn0").css("border", "none")
        $(".layui-layer-btn0").css("background", "#009E96")
        $(".layui-layer-close2").css("display", "none")
      },
      getpickdata: function (orderno, refresh) { //是否需要刷新
        // $(".searchlistcheckBox").eq(19).hide();
        var that = this
        this.datasiNull = false
        var oldlist = that.orderlist
        if (orderno == undefined) {
          orderno = ""
        }
        layer.load(2);

        for (var a = 0; a < this.changnnellist.length; a++) {
          if (this.channelArr[a]) {
            this.channelCode = this.changnnellist[a]
          }
        }
        let ordertypesearch
        // ordertypesearchkey:["CNC","CND","CNDT"],
        // ordertypeList:['闪电送','同城配','门店速提'],
        for (var b = 0; b < this.ordertypesearchkey.length; b++) {
          if (this.ordertypeList[b] == this.orderlistSearchKey) {
            ordertypesearch = this.ordertypesearchkey[b]
            break
          } else if (this.orderlistSearchKey == "订单类型" || this.onderlistSearchKey == undefined) {
            ordertypesearch = ""
          }
        }



        var url =
          `${store.state.runurl}/watsons/rest/gateway/kms/onstore/admin/common/order/pickList?pageNum=${this.pagenum}&pageSize=15&orderNo=${orderno}&channelCode=${this.channelCode}&unavailable=0&orderType=${ordertypesearch}` //${this.orderlistSearchKey}
        // var url = "/testkms"+"/common/order/pickList?pageNum="+this.pagenum+"&pageSize="+15+"&orderNo="+orderno;
        // var url = "/kms"
        var t = store.state.token
        axios({
          type: 'get',
          url: url,
          datatype: "json",
          headers: {
            "Token": t,
            "Content-Type": "application/json;charset=UTF-8"

          }
        }).then((res) => {
          if (res.data.code == 0 && res.data.data != null && res.data.data.list.length >= 0) {

            this.totalCount = res.data.data.total
          }

          if (res.data.code == 0 && res.data.data != null && res.data.data.list.length > 0) {
            this.loadmorestate = true

            // var temorderlist = this.orderlist
            if (this.orderlist.length > 0 && orderno == "" && this.orderlist[0].orderNo != res.data.data.list[0]
              .orderNo && refresh) {
              for (var i = 0; i < res.data.data.list.length; i++) {
                this.orderlist.push(res.data.data.list[i])
                // this.orderlist = this.orderlist.concat(res.data.list)
              }
              var alist = this.orderlist

            } else {
              this.orderlist = res.data.data.list

            }

            for (var i = 0; i < this.orderlist.length; i++) {
              //对比当前订单的 orderfrom字段 和数组中的第i个
              
              for (var a = 0; a <= this.changnnellist.length; a++) {
                if (this.orderlist[i].channelCode == this.changnnellist[a]) {
                  // this.$set(this.orderlist, i, "");
                  this.$set(this.orderlist[i], "channelCodeCN", this.changnnellistCN[a])
                }
              
// 202008281652133
               else if (this.orderlist[i].channelCode == "OTHER") {
                  this.orderlist[i].channelCodeCN = "其他"

                }


              }
            }

            //  loadmorestate

            //  this.orderlist = res.data.list
            if (this.dataorderbystate) {
              this.orderlist.sort(this.down('orderDate'))
            } else {


              this.orderlist.sort(this.up('orderDate'))

            }
          } else if (res.data.code == 403) {
            var that = this
            layer.open({
              title: '',
              className: 'pickingTips',
              content: '登录已过期，现准备重新登录',
              skin: "demo-class",
              btn: ['好的'],
              yes: (index) => {
                // location.reload();
                Router.push("/")

                layer.close(index);
              }
            });

            this.tipscss()
          } else if (res.data.code == 0 && res.data.data.list.length == 0) {
            this.loadmorestate = false
            //提示
            this.datasiNull = true
            this.loadmorestate = false
            this.havenodatastate = false
            this.orderlist = []
            //  layer.msg('无订单...');
            layer.closeAll("loading");
            // layer.msg("数据出错，请联系管理员");
            return;
          } else {
            this.loadmorestate = false
            //提示
            this.datasiNull = true
            this.loadmorestate = false
            this.havenodatastate = false
            this.orderlist = []
            //  layer.msg('无订单...');
            layer.closeAll("loading");
            layer.msg("数据出错，请联系管理员");
            return;

          }

          if (this.orderlist.length >= res.data.data.total && this.orderlist.length > 0 && orderno == "" &&
            oldlist.length >= this.orderlist.length) {
            this.loadmorestate = false
            this.havenodatastate = true
          } else if (this.orderlist.length >= res.data.data.total && this.orderlist.length > 0) {
            this.loadmorestate = false
            this.havenodatastate = false

          }


          this.resetbackground()
          this.initMultipChoiceArr()
          layer.closeAll('loading')
        }, function (res) {
          //失败之后处理逻辑
          //loadding取消
          //提示无数据
          //提示
          layer.closeAll('loading')
          layer.msg('查询数据有问题，请重试');

        })
      },

    },
    mounted() {
      this.initbackground()
      this.initchannelchoice()
      this.getpickdata("", true)
      this.getAPPDate()
      this.sendMsg()
      this.init()
      this.initprintstate()
    },

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->x
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

  .multipechoiceorderBtn {
    width: 100%;
    height: 3.5rem;
    line-height: 3.5rem;
    background-color: #FAE100;
    color: #000;
    text-align: center;

  }

  .multipechoiceorderbox {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 99999;
  }

  .all {
    background: url('../assets/checkbox.png') center center no-repeat;
    background-size: 1rem auto;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    margin: 0 0.5rem;
  }

  .nocheck {
    background: url('../assets/nocheckbox.png') center center no-repeat;
    background-size: 1rem auto;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    margin: 0 0.5rem;
  }

  .unfunctiontype {
    display: flex;
    color: #009E96;
    padding-left: 1rem;
    font-size: 0.85rem;
    height: 1rem;
    line-height: 0.9rem;
  }

  .functiontype {
    display: flex;
    padding-left: 1rem;
    font-size: 0.85rem;
    height: 1rem;
    line-height: 0.9rem;
  }




  .getmoredatapadding {
    padding-bottom: 3rem;
    text-align: center;
    height: 3.5rem;
    line-height: 3rem;
    font-size: 1rem;
    background: #fff;
  }

  .getmoredataunpadding {
    padding-bottom: 0rem;
    text-align: center;
    height: 3.5rem;
    line-height: 3rem;
    font-size: 1rem;
    background: #fff;
  }

  .channelImg {
    width: 0.7rem;
    transform: rotate(-90deg);
  }

  .searchFixedList {
    background: #fff;
    padding-left: 1rem;
    overflow: auto;
    height: 15rem;
    padding-top: 0.3rem;
  }

  .top {
    background: #fff
  }

  .thirdTitle {
    float: left;
    font-size: 1.7rem;
    margin-bottom: 0.3rem;

  }

  .totalCount {
    width: 2rem;
  }

  /* .list1 div{
    display: inline-block;
    /* padding-left: 0.7rem; */


  .orderlistBox {
    display: flex;
    align-items: center;
  }

  .ordernum {
    /* width: 55%;
    padding-right: 1.2rem; */

  }

  .abc {
    background: url('../assets/checkbox.png') center center no-repeat;
    background-size: 1rem auto;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    margin-left: 0.5rem;
  }

  .datatips {
    width: 100%;
    color: #777777;
    text-align: center;
    background: #EFEFF4;
    font-size: 1rem;
    padding: 1rem 0;
  }

  .channelTextDiv {
    width: 34%;
    display: inline-block;
  }

  .channelText {
    color: #FFBD2F;
    margin-left: 1rem;
    display: inline-block;
    line-height: 1.1rem;
    padding: 0.1rem 0.3rem;
    text-align: center;
    margin-bottom: .5rem;
    border-radius: 0.2rem;
    border: 1px solid;
    font-size: 0.6rem
  }

  .orderDate {
    font-size: 1rem;
    color: #9d9d9d;
    font-weight: 400;
    padding-top: 0.3rem;
    margin-left: auto;
  }

  .list1 {
    height: 1.7rem;
    font-weight: 600;
    line-height: 1.6rem;
    display: flex;
    justify-content: flex-start;
  }

  .right {
    display: flex;
    margin-left: auto;
  }

  .orderlist {
    /* padding-bottom: 5rem; */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
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

  .orderlistContent {
    margin: 0.8rem;
    padding: 0.5rem;
    background: #fff;
    border-radius: 0.6rem;
    width: 100%;
  }

  .pickingtotal {
    color: #EC7259;
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

  #third {
    /* font-size: 2rem; */
    overflow: auto;
    /* background: #fff; */
  }

  .index {
    background: #EFEFF4;

  }

  #secondTitle {
    margin: 0.5rem 0;
  }

  .nodata {
    color: #777777;
    background: #f2f2f2;
  }

  .searchKey {
    margin-top: 1rem;
    display: flex;
    justify-content: left;
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
    background: #FAE100;
    color: #000;
    text-align: center;
    margin-top: 1rem;
    margin-right: 1rem;

  }

  .searchlistcheckBox {
    padding: 0.4rem;
    font-size: 0.9rem;
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

  .placeIcon {
    float: left;
    width: 1.5rem;
  }

  #countTips {
    height: 3rem;
    line-height: 4rem;
  }

  .titlename {
    font-weight: 600;
    width: 50%;
    height: 2rem;
    line-height: 3rem;
    margin: auto;
  }

  .title {
    height: 3rem;
    line-height: 1.9rem;
    text-align: center;
  }

  .backPoint {
    width: 4.5%;
    padding-left: 1rem;
    padding-top: 0.8rem;
    float: left;
  }

  .searchInput {
    border: none;
    background: #F2F2F2;
    height: 2rem;
    border-radius: 0.6rem;
    padding-left: 2rem;
    width: 69.5%;
    font-size: 0.8rem;
  }

  .codeIcon {
    width: 1rem;
    position: relative;
    left: 2rem;
    top: 0.2rem;

  }

  .orderby {
    padding-right: 1rem;
    /* float:right; */
    width: 1rem;
    height: 1rem;
    margin-left: auto;
  }

  #channel,
  #searchOrderType {
    padding-bottom: .4rem;
    padding-left: 1rem;
    font-size: 0.85rem;
    height: 1.5rem;
    line-height: 0rem;
    border-bottom: 1px solid #f2f2f2;
    /* margin-bottom: 1rem; */
  }

  .price {
    /* float: right; */
    padding-left: 1rem;
  }

  .searchButton {
    color: #000;
    float: right;
    font-weight: 600;
    position: relative;
    top: 0.4rem;
    right: 1rem;
  }

  .camera {
    position: absolute;
    right: 4.8rem;
    width: 1.3rem;
    top: 3.3rem;
  }

  /*弹框*/
  .maskBoxblack {
    position: fixed;
    top: 7.4rem;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239, 239, 244, 1);
    line-height: 100%;
    z-index: 99999;
    /* text-align: center; */
  }

  /* 多选样式 */
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

  .showLoadding {
    display: block;
  }

  .disshowloadding {
    display: none
  }

  .check {
    position: relative;
  }

  .Checkbox {
    position: absolute;
    visibility: hidden;
  }

  .Checkbox+label {
    position: absolute;
    width: 1.2rem;
    height: 16px;
    border: 1px solid #A6A6A6;
    border-radius: 50%;
    background-color: #FAE100;
  }

  .Checkbox:checked+label:after {
    content: "";
    position: absolute;
    left: 2px;
    top: 2px;
    width: 9px;
    height: 4px;
    border: 2px solid #424242;
    border-top-color: transparent;
    border-right-color: transparent;
    transform: rotate(-45deg);
    -ms-transform: rotate(-60deg);
    -moz-transform: rotate(-60deg);
    -webkit-transform: rotate(-60deg);
  }

  /* 多单拣货提示 */
  .unaTips {
    display: none;
    width: 100%;
    margin: auto;
    padding-left: 1rem;
  }

  .tipsBoxTitle {
    font-weight: 600;
    padding-top: 1rem;
  }

  .tipsBox {
    display: flex;
    margin-bottom: 1rem;
  }

  .tipsBoxContent {
    margin: 1rem 0;
    font-size: 0.8rem;
  }

  .underline {
    width: 100%;
    height: 1px;
    background: #e2e2e2;
  }

  .lockorderlist {
    height: 1.6rem;
    line-height: 1.6rem;
  }

.lockorderbox{
  height: 6rem;
  overflow: auto;
}
</style>
