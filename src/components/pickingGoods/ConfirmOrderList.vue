<template>
  <div id="container">
    <div class="header">
      <nav class="navbar navbar-inverse navbar-fixed-top title">
        <!-- <img class="backPoint clearfix:after" sr c="../assets/backPoint.png"  @click="$router.back(-1)"> -->
        <!-- <img class="backPoint" @click="goBack()" src="../../assets/backPoint.png" /> -->

        <div id="title" class="titlename">多单拣货确认</div>
      </nav>
    </div>

    <div class="layui-form-item unaTips" id="TicketTips">
      <div class="tipsBoxTitle">
        打印小票选择
      </div>
      <div class="tipsBox">
        <div class="layui-input-block">
          <div
            v-bind:class="[PrintType ? unacheck : unaorder]"
            @click="PrintType = false"
          >
            Header
          </div>
          <div
            v-bind:class="[PrintType ? unaorder : unacheck]"
            @click="PrintType = true"
          >
            明细
          </div>
        </div>
      </div>
      <div class="printlist">
        <div
          class="printorderlist"
          v-for="(printorderlist, index) in MultipleOrderList"
          v-bind:class="[
            printselect[index] ? printselectorder : unprintselectorder
          ]"
          @click="selectprintorder(index)"
        >
          <span>
            {{ printorderlist.pocketid }}
          </span>
          <span>{{ printorderlist.orderNo }}</span>
        </div>
      </div>
      <div class="underline"></div>
      <div class="tipsBoxContent">确定要打印？</div>
    </div>
    <div id="content">
      <div id="contentItem">
        <div
          class="orderlistBox"
          v-for="(dataList, index) in MultipleOrderList"
        >
          <div class="orderlistContent">
            <div class="list1">
              <div class="ordernum">{{ dataList.orderNo }}</div>
              <div class="right">
                <div class="count">数量:{{ dataList.orderItem.length }}</div>

                <div class="price clearfix:after">
                  ￥{{ dataList.orderAmt }}
                </div>
              </div>
              <!-- <div class="clearfix"></div> -->
            </div>
            <div class="list1">
              <div class="channelTextDiv">
                <div class="channelText">
                  {{dataList.channelCodeCN==undefined?"未知渠道":dataList.channelCodeCN}}
                </div>
              </div>
              <div class="orderDate price clearfix:after">
                {{ dataList.orderDate }}
              </div>
            </div>
            <div class="list1">
              <div
                v-bind:class="[
                  dataList.PickingResult == '0' || dataList.PickingResult == '5'
                    ? 'Pickingok'
                    : dataList.PickingResult == '1'
                    ? 'PickingFailed'
                    : dataList.PickingResult == '2'
                    ? 'UnaOrderState'
                    : 'PickingFailed'
                ]"
                class="orderstate"
              >
                {{
                  dataList.PickingResult == "0"
                    ? "完成"
                    : dataList.PickingResult == "1"
                    ? "拣货失败:" + dataList.PickingResultReason
                    : dataList.PickingResult == "2"
                    ? "订单缺货"
                    : dataList.PickingResult == "5"
                    ? "部分出货"
                    : dataList.PickingResultReason
                }}
              </div>
            </div>
          </div>
        </div>

        <div id="ButtonGroup">
          <div class="leftBtn" @click="goOrderList()">
            回到首页
          </div>
          <div class="rightBtn" @click="MulPrint()">
            打印订单
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import sortBy from "sort-by";
import qs from "qs";

export default {
  data() {
    return {
      dn: "",
      totalcount: "",
      goodsstate: [],
      goodsstateText: [],
      pickinggoodsstate: "pickinggoodsstate",
      okgoodsstate: "okgoodsstate",
      unagoodsstate: "unagoodsstate",
      MultipleOrderList: [],
      pickitemlist: [], //待拣货的同类itemlist
      quantityCount: "quantityCount",
      quantityCountAfter: "quantityCountAfter",
      planogramId: [],
      mulpickinglist: [],
      alreadypickingitem: [],
      fromdetail: false,
      pickingTimes: false,
      printarr: [],
      mulorderlistlength: 0,
      unaorder: "unaorder",
      unacheck: "unacheck",
      PrintType: true,
      printtimes: 0,
      selectprint: 0,
      // 打印选择样式
      fromprinttips: false,
      printselect: [],
      printselectorder: "printselectorder",
      unprintselectorder: "unprintselectorder",
      Pickingok: "Pickingok",
      PickingFailed: "PickingFailed",
      UnaOrderState: "UnaOrderState"
    };
  },
  computed: {
    // stopGetOrderParam.data.storeShutoutBeginTime = this.getNowDate(false)
  },
  beforeMount() {
    // this.initHeight()
    layer.closeAll("loading");
    this.initConfirmOrderlist();

    //   this.initalreadyData()
  },
  methods: {
    initHeight() {
      let h = $(window).height();
      let topheight = $(".header").height();
      h = h - topheight;
      $("#content").css("height", h);
      $("#content").css("background", "#F2F2F2");
    },
    initConfirmOrderlist() {
      this.MultipleOrderList = this.$store.state.ConfirmMultipleOrderList;
      console.log("  this.MultipleOrderListt", this.MultipleOrderList);
    },
    selectprintorder(i) {
      //把当前选择的订单选项的状态翻转
      this.$set(this.printselect, i, !this.printselect[i]); //取消
    },
    goOrderList() {
      this.$router.push("OrderList");
    },
    MulPrint() {
      //显示layer，提示选择是否打印
      layer.open({
        title: "批量打印小票提示",
        className: "pickingTips",
        type: 1,
        content: $("#TicketTips"),
        skin: "demo-class",
        btn: ["确定", "不打印"],
        yes: index => {
          console.log("this.printState===");
          console.log(this.PrintType);
          layer.msg("正在打印......");
          //打印次数
          //取消条件
          this.printarr = [];
          this.printselect.forEach((item, i) => {
            console.log("printselect", item);
            if (item) {
              this.printarr.push(this.MultipleOrderList[i]);
            }
          });
          if (this.printarr.length > 0 && this.printarr[0]) {
            this.printtimes = 1; //因为此处会默认出发第一次打印

            this.print(this.printarr[0]);
            this.fromprinttips = true;
            this.getappdata();
            layer.close(index);
          } else {
            layer.msg("请选择要打印的订单");
          }
          // this.printarr.push(this.MultipleOrderList[this.selectprint])
        },
        no: function(index) {
          layer.close(index);
        }
      });

      this.tipscss();
      $(".layui-layer-btn0").css("background", "#FAE100");
      $(".layui-layer-btn0").css("color", "#000");
      $(".layui-layer-btn1").css("border", "none");
      $(".layui-layer-content").css("display", "flex");
      $(".layui-layer-content").css("justify-content", "center");
      $(".demo-class").css("width", "76%");
      $(".demo-class").css("left", "45px");
      $(".layui-input-block").css("display", "flex");
      $(".layui-input-block").css("margin-left", "0px");
    },
    print(item) {
      if (this.PrintType) {
        this.showprint(1, false, item);
      } else {
        this.showprint(0, false, item);
      }
    },
    getappdata() {
      this.$bridge.registerHandler(
        "blueprintercallback",
        (data, responseCallback) => {
          setTimeout(() => {
            if (
              data == "0" &&
              this.printtimes < this.printarr.length &&
              this.printarr.length != 0
            ) {
              this.print(this.printarr[this.printtimes]);
              this.printtimes++;
            } else {
              this.printtimes = 0;
              this.printarr = [];
            }
          }, 3000);
        }
      );
    },
    sendMsg() {
      let msg = this.msg;
      this.checkusergoback();
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

      this.$bridge.callHandler("BlueprinterCheck", msg, res => {
        if (res == 1) {
          layer.open({
            title: "",
            className: "pickingTips",
            content: "确定打印订单明细?",
            skin: "demo-class",
            btn: ["确定", "不打印"],
            yes: index => {
              layer.close(index);
              this.MultipleOrderList.forEach((item, i) => {
                this.showprint(1, false, item);
              });
            },
            btn2: index => {
              layer.close(index);
            }
          });
          this.tipscss();
        }
      });
    },
    checkusergoback() {
      this.$bridge.registerHandler("userGoBack", (data, responseCallback) => {
        console.log("CloseWebView====================");
        //批量解锁
        this.mulunlockorder();
      });
    },
    mulunlockorder() {
      let unlockarr = [];
      this.MultipleOrderList.forEach((item, i) => {
        unlockarr.push(this.unlockList(item.orderNo, this.$store.state.cempno));
      });

      Promise.all(unlockarr)
        .then(result => {
          if (result[0].code == 0) {
          } else {
            layer.msg("解锁单失败，请重试");
          }
        })
        .catch(error => {
          console.log(error); // 失败了，打出 '失败'
          layer.msg("解锁单失败，请重试");
        });
    },
    unlockList: function(orderNo, lockId) {
      layer.load(2);
      return new Promise((resolve, reject) => {
        var url =
          this.$store.state.runurl +
          "/watsons/rest/gateway/kms/onstore/admin/common/order/unlockPick";
        var t = this.$store.state.token;
        // var d  = {" orderNo ": "454515722619000003"}
        //             var f = new FormData();
        //             f.append("orderNo",orderNo)
        //             f.append("lockId",lockId)
        var data = {
          orderNo: orderNo,
          lockId: lockId
        };
        $.ajax({
          type: "post",
          data: data,
          url: url,
          datatype: "json",
          // processData: false,
          // contentType: false,
          headers: {
            Token: this.$store.state.token,
            "content-type": "application/x-www-form-urlencoded"
          },
          success: res => {
            if (
              res != null &&
              res != "" &&
              res.code != null &&
              res.code == "0"
            ) {
              // store.state.orderItem = this.orderlist[i]
              // this.sendlockList(this.orderlist[i].orderNo, i)
              //  this.picking = res.data.orderItem.length
            }
            resolve(res);
          },
          error: err => {
            reject(err); // 请求失败则转成Promise对象并判断为reject状态
          }
        });
      });
    },
    initData() {
      this.totalcount = this.$route.query.totalcount;
      this.fromdetail = this.$route.query.fromdetail;
      if (
        this.$store.state.sumItemList != undefined &&
        this.$store.state.sumItemList.length > 0
      ) {
        this.sumItemList = this.$store.state.sumItemList;
        this.ItemList = this.$store.state.allItemList;
        this.MultipleOrderList = this.$store.state.MultipleOrderList;
      } else {
        this.initItemList();
        this.initItemListB();
      }
    },
    initalreadyData() {
      for (const key in this.MultipleOrderList) {
        this.printselect.push(false);
      }
      this.$set(this.printselect, 0, true); //取消

      // this.totalcount = this.$route.query.totalcount
      this.alreadypickingitem = this.$route.query.pickinglist;
      console.log("totalcount", this.totalcount);
      console.log("mulpickinglist", this.mulpickinglist);
      // 每次进来检查totalcount是否为空，不为空就检查mulpickinglist
      // 不为空，就循环匹配orderno和itemno对应的项来修改它的拣货后的itemcount，
      //如果够数，就标记为  已完成
      if (this.alreadypickingitem) {
        //遍历总的ItemList，循环匹配orderno和itemno对应的项来修改它的拣货后的itemcount，

        this.alreadypickingitem.forEach((item, i) => {
          let itemTemp = item;

          this.ItemList.forEach((item, i) => {
            if (
              item.itemNo == itemTemp.itemNo &&
              item.orderNo == itemTemp.orderNo
            ) {
              item.afterQty = itemTemp.mulpickcount;
              // this.$set(this.ItemList[i], "afterQty", itemTemp.mulpickcount)
            }
            if (
              itemTemp.reason != undefined &&
              itemTemp.reason != "" &&
              item.itemNo == itemTemp.itemNo &&
              item.orderNo == itemTemp.orderNo
            ) {
              item.reason = itemTemp.reason;
              item.reasonText = itemTemp.reasonText;
            }
          });
        });
        if (this.alreadypickingitem[0].itemNo != undefined) {
          let result = this.sumItemList.find((value, index, arr) => {
            console.log("arr", arr);
            return value.itemNo == this.alreadypickingitem[0].itemNo;
          });

          if (result) {
            // console.log('result.orderQty--',result.orderQty);

            result.afterQty = this.totalcount;
          }

          // if (result.afterQty == result.orderQty) {

          //   this.goodsstateText.push("完成")
          //   this.goodsstate.push(false)

          // } else {
          //   this.goodsstateText.push("待拣货")
          //   this.goodsstate.push(true)

          // }
        }
      }
      for (var i = 0; i < this.sumItemList.length; i++) {
        this.goodsstateText.push("待拣货");
        this.goodsstate.push(true);
        //如果total不为空，就对比itemno
        if (this.sumItemList[i].afterQty == this.sumItemList[i].orderQty) {
          this.$set(this.goodsstateText, i, "完成");
          this.$set(this.goodsstate, i, false);
        } else if (
          this.sumItemList[i].afterQty < this.sumItemList[i].orderQty &&
          this.alreadypickingitem != undefined
        ) {
          let r = this.ItemList.find((value, index, arr) => {
            return (
              value.itemNo == this.sumItemList[i].itemNo &&
              value.reason != undefined
            );
          });
          if (r && r.reason) {
            this.$set(this.goodsstateText, i, "缺货");
            this.$set(this.goodsstate, i, false);
            // $('#goodsstateforId' + i).css('color', 'red')
          }
        }
      }
    },

    forId: function(index) {
      return "forid_" + index;
    },

    goodsstateforId(index) {
      // if (this.sumItemList[index].afterQty < this.sumItemList[index].orderQty) {
      //   console.log('#goodsstateforId' + index+'red');

      //   $('#goodsstateforId' + index).css('color', 'red')
      // }
      return "goodsstateforId" + index;
      // $('#goodsstateforId' + i).css('color', 'red')
      //检查当前索引下的afteraty 是否 小于qty，
    },
    goBack() {
      layer.open({
        title: "",
        className: "pickingTips",
        content: "若离开本页将不会保存当前拣货数据",
        skin: "demo-class",
        btn: ["确定", "取消"],
        yes: index => {
          this.$store.state.sumItemList = [];
          this.$store.state.MultipleItemList = [];
          this.$store.state.pickitemlist = [];
          this.$store.state.allItemList = [];
          this.$store.state.goodsstate = [];
          this.mulunlockorder();
          this.$router.push({
            name: "OrderList"
          });
          layer.close(index);
        },
        no: index => {
          layer.close(index);
        }
      });
      this.tipscss();
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
      // console.log("=========event.currentTarget.target.id+index;"+event.target.id+index)
      var tips = layer.tips(planogramIdtemp, "#" + event.target.id, {
        tips: [4, "#000"],
        time: 5000
      });
    },
    tipscss() {
      $(".layui-layer-btn1").css("border", "none");
      $(".layui-layer-btn0").css("border", "none");
      $(".layui-layer-btn0").css("border", "none");
      $(".layui-layer-btn0").css("background", "#009E96");
      $(".layui-layer-close2").css("display", "none");
      $(".layui-layer-title").css("display", "none");

      $(".layui-layer-setwin").css("display", "none");
    },
    initItemListB() {
      this.MultipleOrderList = this.$store.state.MultipleOrderList;
      let orderlist = [...this.MultipleOrderList];
      orderlist.forEach((orderItem, i) => {
        console.log("orderItem", orderItem.orderItem);

        orderItem.orderItem.forEach((item, i) => {
          let itemTemp = {
            ...item
          };
          if (itemTemp.itemFlag != "D") {
            // this.$set(itemTemp, "afterQty", 0)
            itemTemp.afterQty = 0;
            if (this.sumItemList.length == 0) {
              this.sumItemList.push(itemTemp);
            } else {
              //  如果 sumItemList  有数据，则需要遍历对比 itemno
              let result = this.sumItemList.find((value, index, arr) => {
                return value.itemNo == itemTemp.itemNo;
              });

              if (result) {
                // console.log('result.orderQty--',result.orderQty);

                result.orderQty =
                  Number(itemTemp.orderQty) + Number(result.orderQty);
              } else {
                this.sumItemList.push(itemTemp);
              }
            }
          }
        });
      });
    },
    initItemList() {
      this.MultipleOrderList = this.$store.state.MultipleOrderList;
      let MultipleItemListTemp = [...this.MultipleOrderList];

      for (let i = 0; i < MultipleItemListTemp.length; i++) {
        //i==0 直接把listitem 塞进去

        for (let z = 0; z < MultipleItemListTemp[i].orderItem.length; z++) {
          if (this.MultipleOrderList[i].orderItem[z].itemFlag != "D") {
            //检查非邮费等

            this.$set(
              this.MultipleOrderList[i].orderItem[z],
              "orderNo",
              this.MultipleOrderList[i].orderNo
            );
            this.$set(this.MultipleOrderList[i].orderItem[z], "afterQty", 0);

            this.ItemList.push(this.MultipleOrderList[i].orderItem[z]);
          }
        }
      }
    },
    initMultipleOrderList() {
      this.MultipleOrderList = this.$store.state.MultipleOrderList;
      // 拆分，重组重复名字的
      for (let i = 0; i < this.MultipleOrderList.length; i++) {
        //i==0 直接把listitem 塞进去
        console.log("this.MultipleOrderList", this.MultipleOrderList);
        for (let z = 0; z < this.MultipleOrderList[i].orderItem.length; z++) {
          let itemlist = [
            {
              orderItem: this.MultipleOrderList[i].orderItem[z],
              orderNo: this.MultipleOrderList[i].orderNo
            }
          ];
          if (this.MultipleOrderList[i].orderItem[z].itemFlag != "D") {
            //检查非邮费等
            if (this.MultipleItemList.length == 0) {
              this.MultipleItemList.push(itemlist);
            } else {
              // 展开运算符测试
              // let MultipleItemListTemp = this.MultipleItemList
              let MultipleItemListTemp = [...this.MultipleItemList]; //复制数组，不止是引用
              for (let k = 0; k < MultipleItemListTemp.length; k++) {
                // console.log('this.MultipleItemList[k][0].orderItem.itemNo', this.MultipleItemList[k][0]
                //   .orderItem
                //   .itemNo)
                // console.log('itemlist[0].orderItem.itemNo', itemlist[0].orderItem.itemNo)
                if (
                  this.MultipleItemList[k][0].orderItem.itemNo ==
                  itemlist[0].orderItem.itemNo
                ) {
                  let itemm = {
                    orderItem: this.MultipleOrderList[i].orderItem[z],
                    orderNo: this.MultipleOrderList[i].orderNo
                  };
                  this.MultipleItemList[k].push(itemm);
                } else {
                  this.MultipleItemList.push(itemlist);
                }
              } //
            }
          }
        }
      }
    },
    toDetails(i) {
      //根据当前itemno筛选出所有item
      //保存当前sum好的list，保存当前总数list
      this.pickitemlist = [];
      this.ItemList.forEach((iterator, k) => {
        // for (const iterator of this.ItemList) {
        if (this.sumItemList[i].itemNo == iterator.itemNo) {
          this.$set(
            iterator,
            "store_barcode",
            this.sumItemList[i].store_barcode
          );

          this.pickitemlist.push(iterator);
        }
      });
      this.$store.state.sumItemList = this.sumItemList;
      this.$store.state.MultipleItemList = this.MultipleItemList;
      this.$store.state.allItemList = this.ItemList;

      this.$store.state.pickitemlist = this.pickitemlist; //记住上次拣货的所有item
      this.$router.push({
        path: "MultipleChoiceArrPickingGoodsDetails",
        query: {
          pickitemlist: this.pickitemlist,
          allItemList: this.ItemList
        }
      });
    },

    changeStr(str, index, changeStr) {
      return (
        str.substr(0, index) + changeStr + str.substr(index + changeStr.length)
      );
    },
    showprint(printstate, autoprint, orderItem) {
      let takecode = "";
      let takenum=orderItem.orderNo.substr(orderItem.orderNo.length-4)
     
      let distributor =
        orderItem.orderType == "CNC"
          ? "门店速提"
          : orderItem.orderType == "CND"
          ? "闪电送"
          : "同城配";
      distributor = `屈臣氏${distributor}订单`;
      let msg;
      let phone = orderItem.shipMobile;
      let shipName = orderItem.shipName;
      if (orderItem.allowOutStockPick) {
        distributor = "";
      }
      if (shipName) {
        let i = 0;
        shipName = shipName.substr(0, 1);
        while (i < length) {
          shipName += "*";
          i++;
        }
      }
      phone = this.changeStr(phone, 3, "****");
      if (printstate == 0) {
        //header

        msg = {
          pagewidth: 900,
          pageheight: 500,
          data: [
            {
              printtype: 1,
              x: 380,
              y: 148,
              printcontent: "取货码",
              fontSize: 2
            },
            {
              printtype: 1,
              x: 380,
              y: 180,
              printcontent: `篮子#${orderItem.pocketid}`,
              fontSize: 2
            },
            {
              printtype: 1,
              x: 520,
              y: 118,
              printcontent:  orderItem.allowOutStockPick? takenum :orderItem.gotCode,
              fontSize: 6,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 4,
              x: 10,
              y: 138,
              printcontent: orderItem.orderNo,
              bartype: 128,
              barrotate: false,
              height: 60
            },
            {
              printtype: 1,
              x: 10,
              y: 200,
              printcontent: orderItem.orderNo,
              fontSize: 2
            },
            {
              printtype: 1,
              x: 10,
              y: 248,
              printcontent: "销售渠道",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 140,
              y: 248,
              printcontent: orderItem.channelCodeCN,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 288,
              printcontent: "顾客姓名",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 140,
              y: 288,
              printcontent: shipName,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 328,
              printcontent: "订单日期",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 140,
              y: 328,
              printcontent: orderItem.orderDate,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 368,
              printcontent: "预约配送时间",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 160,
              y: 368,
              printcontent: orderItem.expectedDeliveryTime,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 260,
              y: 248,
              printcontent: "执货点",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 340,
              y: 248,
              printcontent: this.$store.state.storeNum,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 260,
              y: 288,
              printcontent: "配送方",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 330,
              y: 288,
              printcontent: orderItem.expressName,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              contentWidth: 100,
              contentHeight: 200,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 500,
              y: 248,
              printcontent: "联系电话",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 600,
              y: 248,
              printcontent: phone,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 500,
              y: 288,
              printcontent: "快递单号",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 600,
              y: 288,
              contentWidth: 450,
              contentHeight: 200,
              printcontent: orderItem.logisticsExpressNo,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            }
          ]
        };

        if (orderItem.allowOutStockPick) {
          msg.data.push(
            {
              printtype: 1,
              x: 520,
              y: 338,
              printcontent: "骑手核销码",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 670,
              y: 338,
              printcontent: orderItem.gotCode,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 2,
              x: 50,
              y: 0,
              printcontent: "tmall.png",
              bmpSizeX: 0,
              bmpSizeY: 0
            }
          );
        } else {
          msg.data.push(
            {
              printtype: 1,
              x: 600,
              y: 60,
              printcontent: distributor,
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 2,
              x: 0,
              y: 28,
              printcontent: "watsonslogo.png",
              bmpSizeX: 0,
              bmpSizeY: 0
            },
            {
              printtype: 2,
              x: 300,
              y: 28,
              printcontent: "noreason.png",
              bmpSizeX: 0,
              bmpSizeY: 0
            }
          );
        }
      } else {
        let itemheight = 120;
        let h = 75;
        // ordertypesearchkey:["CNC","CND","CNDT"],
        // ordertypeList:['闪电送','同城配','门店速提'],
        let orderAmt = new Number(orderItem.orderAmt);
        msg = {
          pagewidth: 1000,
          pageheight: 1300 + 120 * orderItem.orderItem.length,

          data: [
            {
              printtype: 4,
              x: 10,
              y: 118,
              printcontent: orderItem.orderNo,
              bartype: 128,
              barrotate: false,
              height: 60
            },
            {
              printtype: 1,
              x: 40,
              y: 180,
              printcontent: orderItem.orderNo,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 550,
              y: 180,
              printcontent: distributor,
              fontSize: 2,
              rotate: 0,
              bold: 3,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 300,
              y: 205,
              printcontent: "商品清单",
              fontSize: 4,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 310,
              printcontent: "销售渠道",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 360,
              printcontent: "订单日期",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 410,
              printcontent: "配送方",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 460,
              printcontent: "执货点",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 140,
              y: 310,
              printcontent: orderItem.channelCodeCN,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },
            {
              printtype: 1,
              x: 140,
              y: 360,
              printcontent: orderItem.orderDate,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },
            {
              printtype: 1,
              x: 140,
              y: 410,
              printcontent: orderItem.expressName,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },
            {
              printtype: 1,
              x: 140,
              y: 460,
              printcontent: this.$store.state.storeNum,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },
            {
              printtype: 1,
              x: 430,
              y: 310,
              printcontent: "顾客姓名",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 430,
              y: 360,
              printcontent: "快递单号",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 430,
              y: 410,
              printcontent: "联系电话",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 10,
              y: 510,
              printcontent: "预约配送时间",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },

            {
              printtype: 1,
              x: 540,
              y: 310,
              printcontent: shipName,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },

            {
              printtype: 1,
              x: 540,
              y: 360,
              printcontent: orderItem.logisticsExpressNo,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },

            {
              printtype: 1,
              x: 540,
              y: 410,
              printcontent: phone,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },

            {
              printtype: 1,
              x: 160,
              y: 510,
              printcontent: orderItem.expectedDeliveryTime,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: true
            },

            {
              printtype: 1,
              x: 25,
              y: 510 + 60,
              printcontent: "序号",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 125 - 30,
              y: 510 + 60,
              printcontent: "商品条码",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 345 - 30,
              y: 510 + 60,
              printcontent: "商品名称",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 580 - 5,
              y: 510 + 60,
              printcontent: orderItem.allowOutStockPick?"":"单价",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 655,
              y: 510 + 60,
              printcontent: "数量",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 750,
              y: 510 + 60,
              printcontent:  orderItem.allowOutStockPick?"":"金额",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },

            {
              printtype: 5,
              linewidth: 1,
              startx: 10,
              starty: 510 + 60 + 30,
              endx: 850,
              endy: 510 + 60 + 30,
              fullline: false
            },

            {
              printtype: 1,
              x: 25,
              y: h * orderItem.orderItem.length + 510 + 140,
              printcontent: orderItem.allowOutStockPick ? "" : "共计",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 35 + 80 + 120 + 380 + 70 + 70 - 10,
              y: h * orderItem.orderItem.length + 510 + 140,
              printcontent: orderItem.allowOutStockPick
                ? ""
                : orderAmt.toFixed(2),
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 25,
              y: h * orderItem.orderItem.length + 510 + 230,
              printcontent: "备注",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 5,
              linewidth: 1,
              startx: 10,
              starty: h * orderItem.orderItem.length + 510 + 100 + 230 + 60,
              endx: 800,
              endy:
                h * Number(orderItem.orderItem.length) + 510 + 100 + 230 + 60,
              fullline: false
            }
          ]
        };

        if(orderItem.version>0){
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

        if (orderItem.allowOutStockPick) {
          msg.data.push(
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
                "printcontent": orderItem.gotCode,
                "fontSize": 6,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
            {
              printtype: 1,
              x: 430,
              y: 460,
              printcontent: "骑手核销码:",
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 630,
              y: 460,
              printcontent: takecode == "" ? "" : takecode,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 2,
              x: 50,
              y: 0,
              printcontent: "tmall.png",
              bmpSizeX: 0,
              bmpSizeY: 0
            },
            {
              printtype: 1,
              x: 580,
              y: 58,
              printcontent: distributor,
              fontSize: 2,
              rotate: 0,
              bold: 1,
              reverse: false,
              underline: false
            }
          );
        } else {
          msg.data.push(
            {
              printtype: 2,
              x: 0,
              y: 28,
              printcontent: "watsonslogo.png",
              bmpSizeX: 0,
              bmpSizeY: 0
            },
            {
              printtype: 2,
              x: 300,
              y: 28,
              printcontent: "noreason.png",
              bmpSizeX: 0,
              bmpSizeY: 0
            }
          );
        }

        let s = 0;
        for (let a = 0; a < orderItem.orderItem.length; a++) {
          console.log('orderItem.orderItem[a].itemName----',orderItem.orderItem[a].itemName)
          let orderQty = orderItem.orderItem[a].orderQty;
          let actualPrice = new Number(orderItem.orderItem[a].actualPrice);
          let singleAmount =
            Number(orderItem.orderItem[a].orderQty) *
            Number(orderItem.orderItem[a].actualPrice);

          // =========单价=========
          let singlealignnum = 0;
          let i = parseInt(actualPrice);
          let l = 0;
          while (i >= 1) {
            i = i / 10;
            l++;
          }
          if (l == 1 || l == 0) {
            singlealignnum = singlealignnum + 10;
          } else if (l == 3) {
            singlealignnum = singlealignnum - 20;
          } else if (l >= 4) {
            singlealignnum = singlealignnum - 25;
          }

          // ==========金额================
          let amountalignnum = 0;
          let b = parseInt(singleAmount);
          let c = 0;
          while (b >= 1) {
            b = b / 10;
            c++;
          }

          if (c == 1 || c == 0) {
            amountalignnum = amountalignnum + 10;
          } else if (c == 3) {
            amountalignnum = amountalignnum - 15;
          } else if (c >= 4) {
            amountalignnum = amountalignnum - 25;
          }

          msg.data.push(
            {
              printtype: 1,
              x: 35,
              y: h * a + 510 + 60 + 50,
              printcontent: a + 1,
              contentWidth: 750,
              contentHeight: 400,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 35 + 80 - 30,
              y: h * a + 510 + 60 + 50,
              printcontent: orderItem.orderItem[a].itemNo,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 35 + 80 + 120 - 30,
              y: h * a + 510 + 60 + 50,
              contentWidth: 280,
              contentHeight: 900,
              printcontent: orderItem.orderItem[a].itemName,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 35 + 80 + 120 + 350 - 10 + singlealignnum,
              y: h * a + 510 + 60 + 50,
              printcontent: orderItem.allowOutStockPick
                ? ""
                : new Number(orderItem.orderItem[a].actualPrice).toFixed(2),
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 35 + 80 + 120 + 380 + 70 - 10,
              y: h * a + 510 + 60 + 50,
              printcontent: orderItem.orderItem[a].afterQty>=0?orderItem.orderItem[a].afterQty:orderItem.orderItem[a].orderQty,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 35 + 80 + 120 + 380 + 70 + 70 - 10 + amountalignnum,
              y: h * a + 510 + 60 + 50,
              printcontent: orderItem.allowOutStockPick
                ? ""
                : singleAmount.toFixed(2),
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            }
          );
          s = a;
        }

        let changecode = 3;
        let qrcode = 3;
        if (orderItem.orderFrom.startsWith("TM_SM")) {
          qrcode = 6;
          changecode = 6;
        } else if (orderItem.orderFrom == "京东") {
          qrcode = 2;
          changecode = 2;
        } else if (orderItem.orderFrom == "京东到家") {
          qrcode = 5;
          changecode = 2;
        } else if (orderItem.orderFrom.startsWith("云店")) {
          qrcode = 4;
          changecode = 5;
        } else if (
          orderItem.orderFrom == "美团" ||
          orderItem.orderFrom == "饿了么"
        ) {
          changecode = 4;
        } else if (
          orderItem.orderFrom.startsWith("莴笋") ||
          orderItem.orderFrom.startsWith("试用瓶")
        ) {
          changecode = 3;
        } else if (orderItem.orderFrom.startsWith("天猫")) {
          qrcode = 1;
          changecode = 2;
        }

        if (changecode != 6) {
          msg.data.push(
            {
              printtype: 1,
              x: 200,
              // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
              y: h * orderItem.orderItem.length + 510 + 100 + 200 + 100,
              printcontent: "尊敬的顾客，如您对订单有任何疑问",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 75,
              // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
              y: h * orderItem.orderItem.length + 510 + 100 + 200 + 150,
              printcontent: `请联系在线客服或致电屈臣氏客服4008301310（移动电话拨打）转${changecode}`,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            }
          );
        } else {
          msg.data.push(
            {
              printtype: 1,
              x: 200,
              // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
              y: h * orderItem.orderItem.length + 510 + 100 + 200 + 100,
              printcontent: "非常感谢您选择闪电送服务，欢迎您再次光临！",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 5,
              // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
              y: h * orderItem.orderItem.length + 510 + 100 + 200 + 150,
              printcontent: `尊敬的顾客，如您对订单有任何疑问，请用天猫或淘宝APP扫描下方猫超二维码`,
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            }
          );
        }

        if (qrcode == 6) {
          msg.data.push(
            {
              printtype: 1,
              x: 350,
              y: h * orderItem.orderItem.length + 510 + 390 + 110,
              printcontent: "猫超客服二维码",
              rotate: 0,
              fontSize: 2,
              qrver: 2,
              qrlel: 0
            },
            {
              printtype: 3,
              x: 350,
              y: h * orderItem.orderItem.length + 510 + 390 + 150,
              printcontent:
                "https://ai.alimebot.taobao.com/intl/index.htm?from=Y1KuElkn1U",
              rotate: 0,
              qrver: 2,
              qrlel: 0
            }
          );
        } else if (qrcode == 3) {
          //三个二维码
          msg.data.push(
            {
              printtype: 1,
              x: 40,
              y: h * orderItem.orderItem.length + 510 + 390 + 110,
              contentWidth: 600,
              contentHeight: 400,
              printcontent: "下载屈臣氏APP",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 30,
              y: h * orderItem.orderItem.length + 510 + 390 + 150,
              contentWidth: 600,
              contentHeight: 400,
              printcontent: "全球美妆1小时闪送到家",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 3,
              x: 60,
              y: h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
              printcontent:
                "https://a.app.qq.com/o/simple.jsp?pkgname=com.watsons.mobile",
              rotate: 0,
              qrver: 2,
              qrlel: 0
            },

            {
              printtype: 1,
              x: 375,
              y: h * orderItem.orderItem.length + 510 + 390 + 110,
              printcontent: "满99减25",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 300,
              y: h * orderItem.orderItem.length + 510 + 390 + 150,
              printcontent: "扫码发关键字【优惠券】领取",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 3,
              x: 350,
              y: h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
              printcontent: "http://weixin.qq.com/q/029BuWYvgjbo_10000M07I",
              rotate: 0,
              qrver: 2,
              qrlel: 0
            },

            {
              printtype: 1,
              x: 640,
              y: h * orderItem.orderItem.length + 510 + 390 + 110,
              printcontent: "如需申请电子发票",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 640,
              y: h * orderItem.orderItem.length + 510 + 390 + 150,
              printcontent: "请扫下方二维码",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 3,
              x: 640,
              y: h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
              printcontent:
                "https://h5.watsons.com.cn/act/2018/1018_invoice/?f=CNDdeliveryreceipt-invoice20191230",
              rotate: 0,
              qrver: 1,
              qrlel: 0
            }
          );
        } else if (qrcode == 1) {
          //天猫cnc 天猫cnd
          msg.data.push(
            {
              printtype: 1,
              x: 330,
              y: h * orderItem.orderItem.length + 510 + 390 + 110,
              printcontent: "扫码获取更多优惠资讯",
              rotate: 0,
              qrver: 2,
              qrlel: 0
            },
            {
              printtype: 3,
              x: 350,
              y: h * orderItem.orderItem.length + 510 + 390 + 150,
              printcontent: "https://m.tb.cn/Q.109c0",
              rotate: 0,
              qrver: 2,
              qrlel: 0
            }
          );
        } else if (qrcode == 2) {
          // 京东
          msg.data.push({
            printtype: 3,
            x: 350,
            y: h * orderItem.orderItem.length + 510 + 390 + 150,
            printcontent: "http://qr02.cn/EDsGVt",
            rotate: 0,
            qrver: 2,
            qrlel: 0
          });
        } else if (qrcode == 5) {
          // 京东到家
          msg.data.push({
            printtype: 3,
            x: 350,
            y: h * orderItem.orderItem.length + 510 + 390 + 150,
            printcontent:
              "http://dj-store-gw.jd.com/qrcode/qrCodeRedirect?type=1&linkId=329840",
            rotate: 0,
            qrver: 2,
            qrlel: 0
          });
        } else if (qrcode == 4) {
          //两个二维码
          msg.data.push(
            {
              printtype: 1,
              x: 150,
              y: h * orderItem.orderItem.length + 50 + 510 + 390 + 100,
              contentWidth: 600,
              contentHeight: 400,
              printcontent: "添加你的美丽顾问",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 120,
              y: h * orderItem.orderItem.length + 50 + 510 + 390 + 150,
              contentWidth: 600,
              contentHeight: 400,
              printcontent: "超新超火超值好物专属推荐",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 3,
              x: 150,
              y: h * orderItem.orderItem.length + 50 + 510 + 390 + 150 + 50,
              printcontent: "http://weixin.qq.com/q/02zpFu4SqAb5T10000007i",
              rotate: 0,
              qrver: 2,
              qrlel: 0
            },

            {
              printtype: 1,
              x: 580,
              y: h * orderItem.orderItem.length + 50 + 510 + 390 + 100,
              printcontent: "屈臣氏会员",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 1,
              x: 520,
              y: h * orderItem.orderItem.length + 50 + 510 + 390 + 150,
              printcontent: "超值权益，一年省超￥800",
              fontSize: 2,
              rotate: 0,
              bold: 0,
              reverse: false,
              underline: false
            },
            {
              printtype: 3,
              x: 550,
              y: h * orderItem.orderItem.length + 50 + 510 + 390 + 150 + 50,
              printcontent: "http://weixin.qq.com/q/02J21S5AqAb5T10000M073",
              rotate: 0,
              qrver: 2,
              qrlel: 0
            }
          );
        }
      }
      if (autoprint) {
        this.autoprint(msg, printstate);
      } else {
        console.log(msg);
        this.$bridge.callHandler("BlueprinterCall", msg, res => {
          this.callprintlog();
        });
      }
    },

    autoprint(msg, printState) {
      let content = "小票";
      let that = this;
      if (printState == 0) {
        content = "Header";
      }
      layer.open({
        title: "",
        className: "pickingTips",
        content: "确定打印" + content + "?",
        skin: "demo-class",
        btn: ["确定", "不打印"],
        yes: index => {
          layer.close(index);
          this.$bridge.callHandler("BlueprinterCall", msg, res => {});
          if (this.pickingstate) {
            Router.push({
              name: "OrderList"
            });
          }
        },
        btn2: index => {
          if (this.pickingstate) {
            Router.push({
              name: "OrderList"
            });
            layer.close(index);
          }
        }

        // no: (index) => {
        //   Router.push({
        //       name: 'OrderList'
        //     })
        //   layer.close(index);
        // }
      });
      this.tipscss();
    }
  }
};
</script>

<style scoped>
/* 顶部================================ */
.title {
  height: 3rem;
  display: flex;
  align-items: center;
  text-align: center;
  background: #fff;
  font-weight: 600;
}

#title {
  flex: 1;
}

.backPoint {
  position: absolute;
  width: 1rem;
  padding-left: 1rem;
}

.codeIcon {
  width: 1rem;
  position: relative;
  left: 2rem;
}

#searchBox {
  display: none;
  align-items: center;
  background: #fff;
}

.searchButton {
  margin-left: auto;
  padding-right: 1rem;
}

.searchInput {
  border: none;
  background: #f2f2f2;
  height: 2rem;
  border-radius: 0.6rem;
  padding-left: 2rem;
  width: 70.5%;
  font-size: 0.8rem;
}

/* 内容 */
#content {
  height: 33rem;
  padding-top: 4rem;
  background: #f2f2f2;
}

.contentTitle {
  display: flex;
  justify-content: space-around;
  padding-bottom: 0.5rem;
}

#contentItem {
  padding-bottom: 5rem;
  overflow: auto;
  background: #f2f2f2;
}

.orderlistContent {
  margin: 0.8rem;
  padding: 0.5rem;
  background: #fff;
  border-radius: 0.6rem;
  width: 100%;
}

.printorderlist {
  height: 2rem;
  line-height: 1.5rem;
}

.goodsList {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 3rem;
  border-bottom: 1px solid #f2f2f2;
  font-size: 0.9rem;
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

.unagoodsstate {
  border: none;
  float: right;
  width: 11%;
  padding-right: 1rem;
  padding-top: 0.5rem;
  text-align: right;
  color: red;
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

.orderName {
  display: inline-block;
  width: 60%;
  color: #9d9d9d;
  font-size: 0.8rem;
  overflow: hidden;
  word-break: break-word;
}

.goodslist1 div {
  display: inline-block;
}

.goodslist1,
.goodslist2,
.goodslist3 {
  padding-left: 1rem;
  /* height: 1.7rem; */
  line-height: 1.7rem;
}

.moreplanogram {
  display: none;
}

.classQty {
  padding: 0.5rem 1.5rem;
}

.goodslist2 {
  display: flex;
  justify-content: space-between;
}

.goodsordernum,
.goodsmoudle {
  font-weight: 600;
}

.goodsmoudle {
  width: 45%;
  font-size: 0.8rem !important;
  color: #8d8d8d !important;
}

.goodsordernum {
  width: 25%;
}

/* 底部按钮 */
#ButtonGroup {
  position: fixed;
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  bottom: 0;
  text-align: center;
  display: flex;
}

.leftBtn {
  width: 50%;
  background: #42b983;
  color: #fff;
}

.rightBtn {
  width: 50%;
  background: #fae100;
  color: #000;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
}

/* 打印提示样式 */
.unaTips {
  display: none;
  width: 100%;
  margin: auto;
  padding-left: 1rem;
}

.tipsBoxTitle {
  font-weight: 600;
  height: 4rem;
  line-height: 3rem;
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

.tipsBoxContent {
  margin-bottom: 1.1rem;
  margin-top: 1rem;
}

.unaorder {
  width: 5rem;
  height: 2rem;
  margin-right: 1rem;
  display: inline-block;
  background: #fae100;
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

.printselectorder {
  background: #fae100;
}

.unprintselectorder {
  background: #fff;
}

.orderlistBox {
  display: flex;
  align-items: center;
}

.list1 {
  height: 1.7rem;
  font-weight: 600;
  line-height: 1.6rem;
  display: flex;
  justify-content: flex-end;
}

.right {
  display: flex;
  margin-left: auto;
}

.price {
  padding-left: 1rem;
}

.channelTextDiv {
  width: 34%;
  display: inline-block;
}

.channelText {
  color: #ffbd2f;
  margin-left: 1rem;
  display: inline-block;
  line-height: 1.1rem;
  padding: 0.1rem 0.3rem;
  text-align: center;
  margin-bottom: 0.5rem;
  border-radius: 0.2rem;
  border: 1px solid;
  font-size: 0.6rem;
}

.orderDate {
  font-size: 1rem;
  color: #9d9d9d;
  font-weight: 400;
  padding-top: 0.3rem;
  margin-left: auto;
}

#container {
  background: #fff;
}

.orderstate {
  font-weight: 400;
  font-size: 0.9rem;
}

.Pickingok {
  padding-top: 0.5rem;
  color: #009e96;
}

.PickingFailed {
  padding-top: 0.5rem;
  color: red;
}

.UnaOrderState {
  padding-top: 0.5rem;
  color: #ffbd2f;
}
</style>
