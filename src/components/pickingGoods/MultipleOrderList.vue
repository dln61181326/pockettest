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
          <div v-bind:class="[UnavailableItemState ? unaorder : unacheck ]" v-if="!havetmalorder" @click="UnavailableItemState = true">订单缺货
          </div>
        </div>
      </div>
      <div class="tmallTips"v-if="havetmalorder">猫超订单请按照实际拣货点击缺货反馈</div>
      <div class="underline"></div>
      <div class="tipsBoxContent">确定要提交缺货申请？</div>
    </div>
    <nav class="navbar navbar-inverse navbar-fixed-top top">

      <div class="title">
        <img class="backPoint clearfix:after" src="../../assets/backPoint.png" @click="goback()">
        <div class="titlename">{{MulOrderListTitile}}</div>
        <div class="clearfix"></div>
      </div>
      <!--  class="navbar navbar-inverse navbar-fixed-top"  -->
    </nav>

    <div id="third">
      <div v-if="datasiNull" class="datatips">无相关数据</div>

      <div class="orderlist">
        <div class="orderlistBox" v-for="(dataList,index) in orderlist">
          <div v-if="MultipleChoiceState"
            v-bind:class="[MultipleChoiceArr[index]==true ? Multiplechoose : MultipleUnchoose ]"
            @click="SelectMultiplehoiceOrder(index)"></div>




          <div class="orderlistContent">
            <div class="pocketnum">#{{dataList.pocketid}}</div>
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

        <div class="getmoredata" v-if="loadmorestate" @click="getmoredata()">加载更多</div>
        <div class="getmoredata nodata" v-if="havenodatastate">已经无数据了....</div>

      </div>


    </div>

    <!-- <div class="multipechoiceorderbox">
      <div class="multipechoiceorderBtn" @click="beginMultiplePicking()">
        开始分拣货
      </div>
    </div> -->
    <div class="ButtonGroup">

      <div id="pickbutton" v-if="!unastate" class="goodsTipsButton clearfix:after" @click="beginMultiplePicking()">开始分拣
      </div>
      <div id="nopickbutton" v-if="unastate" class="goodsTipsButton clearfix:after" @click="toShortage()">缺货申请</div>
      <div class="clearfix"></div>

    </div>

  </div>



  </div>

</template>

<script>
  import $ from 'jquery'
  import store from '../../vuex/store';
  import axios from 'axios';

  export default {
    name: 'HelloWorld',
    components: { //引用重复页面模块
    },
    data() {
      return {
        windowheight: "",
        datasiNull: false,
        UnavailableItemState: false, //判断缺货登记还是订单缺货
        page: 1,
        choosechannel: 'all',
        unchoosechannel: 'nocheck',
        unfunctiontype: "unfunctiontype",
        functiontype: "functiontype",
        pagenum: 1,
        MulOrderListTitile: "多单拣货订单",
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
          "PZ", "ZCS_TB", "MYSTORE", 'TM_SM'
        ],
        changnnellistCN: ["全部", "莴笋自营", "莴笋美团", "莴笋饿了么", "天猫商城", "京东商城", "京东到家美妆", "京东到家药店", "自动售货机", "七乐康平台", "平安好医生",
          "云店", "积分商城", "试用瓶", "云店2.0", "天猫超市"
        ],
        //  多单拣货变量
        MultipleChoiceState: false,
        MultipleChoiceStateList: [], //把用户点击选择的订单保存
        MultipleChoiceArr: [], //记录用户点击了哪个
        MultipleUnchoose: "nocheck",
        Multiplechoose: "all",
        unaorder: "unaorder",
        unacheck: "unacheck",
        Shortage: {}, //缺货字段
        unastate: false,
        printarr: [],
        printtimes: 0,
        havetmalorder:false
      }
    },


    methods: {
      beginMultiplePicking() {
        // store.state.MultipleOrderList =  this.MultipleChoiceStateList
        // Router.push('MultipleChoiceArrPickingGoodsList')

        this.$store.state.MultipleOrderList = this.orderlist
        this.$store.state.ConfirmMultipleOrderList = [...this.orderlist]
        this.$router.push({
          path: "MultipleChoiceArrPickingGoodsList",
          query: {
            // pickinglist: this.MultipleChoiceStateList

          }
        })
      },
      checkusergoback() {
        this.$bridge.registerHandler('userGoBack', (data, responseCallback) => {
          console.log("CloseWebView====================")
          this.mulunlockorder()
        })
      },

      mulunlockorder() {
        let unlockarr = []
        this.orderlist.forEach((item, i) => {
          unlockarr.push(this.unlockList(item.orderNo, this.$store.state.cempno))
        });

        Promise.all(unlockarr).then((result) => {
          if (result[0].code == 0) {} else {
            layer.msg('解锁单失败，请重试')
          }
        }).catch((error) => {
          console.log(error) // 失败了，打出 '失败'
          layer.msg('解锁单失败，请重试')
        })
      },

      unlockList: function (orderNo, lockId) {
        layer.load(2);
        return new Promise((resolve, reject) => {

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

              },
              success: (res) => {
                if (res != null && res != "" && res.code != null && res.code == "0") {
                  // store.state.orderItem = this.orderlist[i]
                  // this.sendlockList(this.orderlist[i].orderNo, i)
                  //  this.picking = res.data.orderItem.length
                }
                resolve(res)
              },
              error: err => {
                reject(err); // 请求失败则转成Promise对象并判断为reject状态
              }
            }

          )
        })
      },
      getappdata() {

        this.$bridge.registerHandler('blueprintercallback', (data, responseCallback) => {
          if (data == "0" && this.printtimes < this.printarr.length && this.printarr.length != 0) {

            this.showprint(1, false, this.printarr[this.printtimes])
            this.printtimes++
          } else {
            this.printtimes = 0
            this.printarr = []
            layer.msg('批量打印完成')
          }
        })
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
      MulunaOrder() {
        let unagoodsarr = []
        let MultipleChoiceStateList = [...this.MultipleChoiceStateList]
        if (MultipleChoiceStateList.length == 0) {
          layer.msg('订单数量异常，请检查！')
          return
        }
        let MultipleChoiceStateListlength = this.MultipleChoiceStateList.length

        MultipleChoiceStateList.forEach((item, i) => {
          this.pickinglist = item.orderItem
          this.$set(this.Shortage, "orderNo", item.orderNo)
          this.$set(this.Shortage, "orderDate", item.orderDate)
          this.$set(this.Shortage, "storeNo", this.$store.state.storeNum)

          this.$set(this.Shortage, "creater", this.$store.state.cempno)
          this.$set(this.Shortage, "orderChannel", item.channelCode)
          this.$set(this.Shortage, "items", [])
          console.log('----------------------------');

          var equalQty = true

          var cangoshortage = false
          var enoughCount = false
          for (var i = 0; i < this.pickinglist.length; i++) {
            var orderQty = this.pickinglist[i].orderQty
            var addnum = this.pickinglist[i].afterQty
            var una = Number(orderQty) - Number(addnum)
            if (this.pickinglist[i].itemFlag != undefined && this.pickinglist[i].itemFlag != "" && this.pickinglist[
                i]
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
            return;
          } else {
            for (var a = 0; a < this.changnnellist.length; a++) {

              if (store.state.channelArr == this.changnnellistCN[a]) {
                store.state.channelArr = this.changnnellist[a]
              }

            }
            unagoodsarr.push(this.Shortage)
            // this.unavailable(item.orderNo)
            // this.MultipleChoiceStateList.splice(this.MultipleChoiceStateList.findIndex(v => v.orderNo == item.orderNo))
            console.log(item.orderNo)
            console.log(this.Shortage)

            this.Shortage = {}
          }
        })

        this.unavailable(unagoodsarr[0].orderNo, unagoodsarr)


      },
      toShortage() {
        let result = this.MultipleChoiceStateList.find((value, index, arr) => {
                  return value.allowOutStockPick == true
                })
                if(result){
                  this.havetmalorder = true
                }else{
                  this.havetmalorder = false
                }
                // layer.msg('操作的订单中有猫超订单，不能选订单缺货')
        layer.open({
          title: "",
          className: 'pickingTips',
          type: 1,
          content: $('#unaTips'),
          skin: "demo-class",
          btn: ['确定', '取消'],
          yes: (index) => {
            // location.reload();
            // this.unavailable(this.orderItem.orderNo)
            this.MulunaOrder()
            console.log('-------');

            layer.close(index);
          },
          no:  (index)=> {
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
      pickingPocketafter: function (orderNo) {
        layer.load(2);
        return new Promise((resolve, reject) => {
          var url = this.$store.state.runurl + "/watsons/rest/gateway/kms/onstore/admin/common/order/picking";
          var t = this.$store.state.token
          var d = {
            'orderNo': orderNo,
            'lockId': this.$store.state.cempno
          }
          let result = this.orderlist.find((value, index, arr) => {
                  return value.orderNo == orderNo
                })
          console.log('result',result)
          if(result.orderFrom.startsWith("TM")||result.orderFrom.startsWith("天猫商城")){

          d['version'] = result.version 
          }
          if(result.allowOutStockPick){
            let returnDataList = []
            result.orderItem.forEach((item,i) => {
            if(item.itemFlag!="D"){            
              
            let returnData = {
            'pickupQty':item.afterQty,
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
            data: d,
            datatype: "json",
            headers: {
              "Token": t,
              'Content-Type': 'application/x-www-form-urlencoded'

            },
            success: (res) => {
              layer.closeAll('loading')
              console.log('res', res);
              if (res.code == 0) {
                let re = this.MultipleChoiceStateList.findIndex(v => v.orderNo == orderNo)
                this.printarr.push(this.orderlist[re])

                this.MultipleChoiceStateList.splice(re, 1)
                // this.orderlist.splice(this.orderlist.findIndex(v => v.orderNo == orderNo), 1)
                let i = this.$store.state.ConfirmMultipleOrderList.findIndex((v => v.orderNo == orderNo), 1)
                this.$set(this.$store.state.ConfirmMultipleOrderList[i], "PickingResult", 0)


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
                    this.$router.push("/")

                    layer.close(index);
                  }
                });

                that.tipscss()
              } else {
                layer.msg('拣货失败'+res.msg);
                this.MultipleChoiceStateList.splice(re, 1)
              this.orderlist.splice(this.orderlist.findIndex(v => v.orderNo == orderNo), 1)
              let i = this.$store.state.ConfirmMultipleOrderList.findIndex((v => v.orderNo == orderNo), 1)
              this.$set(this.$store.state.ConfirmMultipleOrderList[i], "PickingResult", 1)
              this.$set(this.$store.state.ConfirmMultipleOrderList[i], "PickingResultReason","订单提交失败:"+res.msg)
              }
              resolve(res)

            },
            error: err => {
              this.MultipleChoiceStateList.splice(re, 1)
              this.orderlist.splice(this.orderlist.findIndex(v => v.orderNo == orderNo), 1)
              let i = this.$store.state.ConfirmMultipleOrderList.findIndex((v => v.orderNo == orderNo), 1)
              this.$set(this.$store.state.ConfirmMultipleOrderList[i], "PickingResult", 1)
              this.$set(this.$store.state.ConfirmMultipleOrderList[i], "PickingResultReason","订单提交失败:"+err.msg)

              reject(err); // 请求失败则转成Promise对象并判断为reject状态

            }

          })

        })

      },

      pickingPocket: function (orderNo) {
        layer.load(2);
        // return new Promise((resolve, reject) => {

        var url = store.state.runurl + "/watsons/rest/gateway/kms/onstore/admin/common/order/picking";
        var t = store.state.token
        var d = {
          'orderNo': orderNo,
          'lockId': store.state.cempno
        }
        $.ajax({
          type: 'POST',
          url: url,
          data: d,
          datatype: "json",
          headers: {
            "Token": t,
            'Content-Type': 'application/x-www-form-urlencoded'

          }
        }).then((res) => {
          layer.closeAll('loading')
          if (res.code == 0) {
            let re = this.MultipleChoiceStateList.findIndex(v => v.orderNo === orderNo)
            this.printarr.push(this.orderlist[re])

            this.MultipleChoiceStateList.splice(re, 1)
            this.orderlist.splice(this.orderlist.findIndex(v => v.orderNo == orderNo), 1)
            //剔除订单之后，检查数组是不是为零，

            // 若为零，提示用户打印

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
            layer.msg('拣货失败，请重试');
            return
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

      unavailable(orderNo, unagoodsarr) { //缺货逻辑
        layer.load(2);
        console.log('unaorder---');
        var url = store.state.runurl + "/onstore/admin/common/order"
        if (this.UnavailableItemState) {

          url += "/addUnavailableItem"
        } else {

          url += "/insertUnavailableItem"
        }
        var t = store.state.token
        $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify(unagoodsarr[0]),
          headers: {
            "Token": t,
            'Content-Type': 'application/json'

          },
          success: (res) => {
            layer.closeAll('loading')
            //根据要求push unagoodsarr

            //把unagoodsarr的第0个放进去做缺货，成功则把对应的orderno的单从unagoodsarr中删除,根据订单号调用拣货接口
            //如果unagoodsarr.length>0,再执行缺货接口
            //如果 unagoodsarr.length==0 提示要不要打印
            console.log('unavailable----')
            if (res.code == 0) {
              //调拣货接口
              let result = this.MultipleChoiceStateList.findIndex(v => v.orderNo == orderNo)
              if (!this.UnavailableItemState) {
                // 如果是订单缺货，就把当前订单列表删除该订单
                // this.printarr.push(this.MultipleChoiceStateList[result])
                this.pickingPocketafter(orderNo) //如果是缺货登记成功，就把这个单重新提交拣货
                  .then(
                    (data) => {
                      if (data.code == 0) {
                        let o = this.orderlist
                        let re = this.orderlist.findIndex(v => v.orderNo === orderNo)
                        if (re == -1) {
                          unagoodsarr.splice(unagoodsarr.findIndex(v => v.orderNo == orderNo), 1)
                        }
                        //=============================执行下一个循环============================
                        if (unagoodsarr.length > 0) { //用户选择操作的单
                          this.unavailable(unagoodsarr[0].orderNo, unagoodsarr)
                        } else { //已经循环完
                          console.log('printarr', this.printarr);
                          if (this.MultipleChoiceStateList.length == 0 && this.printarr.length > 0 && !this
                            .UnavailableItemState) {
                            layer.open({
                              title: '',
                              className: 'pickingTips',
                              content: '批量拣货已完成,是否打印刚才提交的订单明细?',
                              skin: "demo-class",
                              btn: ['确定', '不打印'],
                              yes: (index) => {
                                layer.close(index);
                                this.printtimes = 1 //因为此处会默认出发第一次打印
                                this.showprint(1, false, this.printarr[0])
                                this.getappdata()
                                // this.printarr.forEach((item, i) => {
                                //   this.showprint(1, false, item)
                                // })
                              },
                              btn2: (index) => {
                                layer.close(index);

                                if (this.orderlist.length == 0) {
                                  this.$router.push("ConfirmOrderList")
                                } else {
                                  this.printtimes = 0
                                  layer.msg('缺货操作已完成,请继续其他流程')
                                }
                              }
                            });
                            this.tipscss()
                          } else if (this.MultipleChoiceStateList.length == 0 && this.printarr.length == 0) {
                            this.$router.push("ConfirmOrderList")
                            layer.msg('多单拣货已完成')
                          } else if (this.MultipleChoiceStateList.length > 0 && this.printarr.length == 0) {
                            layer.msg('缺货操作已完成，请继续其他流程')


                          }
                        }
                        for (const key in this.MultipleChoiceArr) {
                          this.$set(this.MultipleChoiceArr, key, false)
                        }
                      } else {
                        layer.msg(`拣货不成功:${data.msg}`)
                      }
                    },
                    (reason, data) => {
                      loading.closeAll()
                      console.log('rejected失败回调');
                      console.log('失败执行回调抛出失败原因：', reason);
                      layer.msg(`拣货不成功:${data.msg}`)
                    }

                  )
              }
              let Confirmindex = this.$store.state.ConfirmMultipleOrderList.findIndex(v => v.orderNo ==
                orderNo)

                this.$set(this.$store.state.ConfirmMultipleOrderList[Confirmindex], "PickingResult", 2)

            } if (res.code == 600) {
              layer.open({
                title: '',
                className: 'pickingTips',
                content: '登录已过期，现准备重新登录',
                skin: "demo-class",
                btn: ['好的'],
                yes: function (index) {
                  // location.reload();
                  this.$router.push("/")

                  layer.close(index);
                }
              });

              this.tipscss()
            } else {
             

                        let unagoodsarrindex = unagoodsarr.findIndex(v => v.orderNo == orderNo)
                        let re = this.orderlist.findIndex(v => v.orderNo == orderNo)
                        console.log('findIndex',re);
                        if (unagoodsarrindex != -1) {
                          unagoodsarr.splice(unagoodsarrindex, 1)
                        }
                        if (re != -1) {
                          this.orderlist.splice(re, 1)
                        }

                        //=============================执行下一个循环============================
                        
                        let Confirmindex = this.$store.state.ConfirmMultipleOrderList.findIndex(v => v.orderNo ==
                orderNo)

                this.$set(this.$store.state.ConfirmMultipleOrderList[Confirmindex], "PickingResult", 3)
                this.$set(this.$store.state.ConfirmMultipleOrderList[Confirmindex], "PickingResultReason","订单缺货提交失败")
                if (unagoodsarr.length > 0) { //用户选择操作的单
                          this.unavailable(unagoodsarr[0].orderNo, unagoodsarr)
                        }else{
                          if (this.orderlist.length == 0 && unagoodsarr.length == 0) {
                            this.$router.push("ConfirmOrderList")
                            layer.msg('多单拣货已完成')
                          } else if (this.orderlist.length > 0 &&unagoodsarr.length == 0) {
                            layer.msg('缺货操作已完成，请继续其他流程')


                          }
                        }

              layer.msg(res.msg);
            }

          }
        })
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
        layer.open({
          title: '',
          className: 'pickingTips',
          content: '若离开本页将不会保存当前拣货数据',
          skin: "demo-class",
          btn: ['确定', '取消'],
          yes: (index) => {
            this.$store.state.sumItemList = []
            this.$store.state.MultipleItemList = []
            this.$store.state.pickitemlist = []
            this.$store.state.allItemList = []
            this.$store.state.goodsstate = []
            this.mulunlockorder()

            this.$router.push({
              name: 'OrderList'
            })
            layer.close(index);
          },
          no: (index) => {
            layer.close(index);
          }
        });
        this.tipscss()
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
        this.$router.push("ConfirmOrderList")
      },
      getappdata() {

        this.$bridge.registerHandler('blueprintercallback', (data, responseCallback) => {
          setTimeout(() => { 

            if (data == "0" && this.printtimes < this.printarr.length && this.printarr.length != 0) {
              this.print(this.printarr[this.printtimes])
              this.printtimes++
            } else {
              this.printtimes = 0
              this.printarr = []
              // this.toNextPage()
            }
          }, 3000);
        })
      },
      sendMsg() {
        let msg = this.msg
        var that = this
        this.checkusergoback()
        console.log("getAPPDate================")
        if (store.state.phonetype == "urovo" || store.state.phonetype == "TC51" || store.state.phonetype ==
          "UBX" ||
          store.state.phonetype == "DT50") {

          this.$bridge.callHandler('redScanCodeCall', msg, (res) => {})
        } else if (store.state.phoneType == undefined || store.state.phoneType == "") {
          this.$bridge.callHandler('redScanCodeCall', msg, (res) => {
            // alert('获取app响应数据:'+res)
            this.test = res
          })
        }
        // alert('获取app响应数据:'+res)

        this.$bridge.callHandler('BlueprinterCheck', msg, (res) => {

          // if (res == 1 && !this.unastate) {


          //   layer.open({
          //     title: '',
          //     className: 'pickingTips',
          //     content: '是否全部打印Heard?',
          //     skin: "demo-class",
          //     btn: ['确定', '不打印'],
          //     yes: (index) => {
          //       layer.close(index);
          //       // this.orderlist.forEach((item, i) => {
          //       //   this.printarr.push(item)

          //       // })
          //       // this.printtimes = 0
          //       // this.showprint(0, false, this.printarr[0])

          //     },
          //     btn2: (index) => {
          //       layer.close(index);

          //     }
          //   });
          //   this.tipscss()
          // }

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
        this.$store.state.ConfirmOrderlist  =  this.orderlist
        this.orderlist = this.$route.query.pickinglist
        if (this.$route.query.MultipleOrderList) { //不是首次进来
          this.MulOrderListTitile = "多单拣货缺货申请"
          this.unastate = !this.unastate //显示缺货按钮
        }
        if (!this.orderlist) {

          this.MultipleChoiceState = true
          this.orderlist = this.$route.query.MultipleOrderList
          if (!this.orderlist) {
            layer.msg('没有可操作订单，请检查已操作过的订单')
            this.$router.push("ConfirmOrderList")
          }

        } else {
          this.orderlist.forEach((iterator, i) => {
            this.$set(iterator, 'pocketid', i + 1)
          });
        }
        this.dn = store.state.phoneType
        if (store.state.phonetype == undefined || store.state.phonetype == "" || store.state.phonetype ==
          null || store
          .state.phonetype == "urovo" || store.state.phonetype == "TC51" || store.state.phonetype == "UBX" ||
          store
          .state.phonetype == "DT50") {
          this.showCamera = false
        }
        this.Selectchanne(store.state.inde)
        // },

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

          this.MultipleChoiceStateList.push(this.orderlist[i])
          this.$set(this.MultipleChoiceArr, i, !this.MultipleChoiceArr[i]); //取消

        }

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


          }
        }).then((res) => {

          layer.closeAll('loading')
          // console.log("res-----------------"+res)
          if (res != null && res.code == 0) {
            store.state.orderItem = this.orderlist[i]
            store.state.channelArr = this.orderlist[i].channelCode
            store.state.channelCodeCN = this.orderlist[i].channelCodeCN
            store.state.sort = this.dataorderbystate
            console.log("this.dataorderbystate=======================" + this.dataorderbystate)
            Router.push("Details")
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
            layer.msg('打开订单失败:'+res.msg);
          }
        }, function (res) {
          //失败之后处理逻辑
          //loadding取消
          //提示订单异常，请联系管理员

          layer.closeAll('loading')
          layer.msg('订单异常，请联系管理员');
        })
      },
      unlockList: function (orderNo, lockId) {
        layer.load(2);
        return new Promise((resolve, reject) => {

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
                "Token": this.$store.state.token,
                "content-type": 'application/x-www-form-urlencoded'

              },
              success: (res) => {
                if (res != null && res != "" && res.code != null && res.code == "0") {
                  // store.state.orderItem = this.orderlist[i]
                  // this.sendlockList(this.orderlist[i].orderNo, i)
                  //  this.picking = res.data.orderItem.length
                }
                resolve(res)
              },
              error: err => {
                reject(err); // 请求失败则转成Promise对象并判断为reject状态
              }
            }

          )
        })
      },

      choice: function (index) {
        for (var a = 0; a < this.channelArr.length; a++) {
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
        $("#third").css("height", w)

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
            if (this.orderlist.length > 0 && orderno == "" && this.orderlist[0].orderNo != res.data.data
              .list[0]
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

                if (this.orderlist[i].channelCode == "OTHER") {
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
      autoprint(msg, printState) {
        console.log('msg', msg);

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
              Router.push({
                name: 'OrderList'
              })
            }

          },
          btn2: (index) => {

            if (this.pickingstate) {
              Router.push({
                name: 'OrderList'
              })
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
        this.tipscss()
      },
      changeStr(str, index, changeStr) {
        return str.substr(0, index) + changeStr + str.substr(index + changeStr.length);
      },

      showprint(printstate, autoprint, orderItem) {
        let takecode=""
        let takenum=orderItem.orderNo.substr(orderItem.orderNo.length-4)
        
        let distributor = orderItem.orderFrom == 'DBD' ? '调拨单':orderItem.orderItem.orderType == 'CNC' ? '门店速提' : orderItem.orderItem.orderType == 'CND' ? '闪电送' : '同城配'
        distributor = `屈臣氏${distributor}订单`
        if(orderItem.orderItem.allowOutStockPick&&orderItem.orderFrom != 'DBD'){
          distributor = ""
        }
        let msg
        let phone = orderItem.shipMobile
        let shipName = orderItem.shipName
        if (shipName) {
          let i = 0
          shipName = shipName.substr(0, 1)
          while (i < length) {
            shipName += "*"
            i++
          }
        }
        phone = this.changeStr(phone, 3, "****")
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
                "printtype": 1,
                "x": 380,
                "y": 180,
                "printcontent": `篮子#${orderItem.pocketid}`,
                "fontSize": 2,
              },
              {
                "printtype": 1,
                "x": 450,
                "y": 118,
                "printcontent": orderItem.allowOutStockPick? takenum :orderItem.gotCode,
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
                "printcontent": orderItem.orderNo,
                "bartype": 128,
                "barrotate": false,
                "height": 60
              },
              {
                "printtype": 1,
                "x": 10,
                "y": 200,
                "printcontent": orderItem.orderNo,
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
                "printcontent": orderItem.channelCodeCN,
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
                "printcontent": orderItem.orderDate,
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
                "x": 160,
                "y": 368,
                "printcontent": orderItem.expectedDeliveryTime,
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
                "printcontent": orderItem.expressName,
                "fontSize": 2,
                "rotate": 0,
                "contentWidth": 100,
              "contentHeight": 200,
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
                "printcontent": orderItem.logisticsExpressNo,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },

            ]


          }


          if(orderItem.allowOutStockPick&&orderItem.orderFrom != 'DBD'){
            msg.data.push( 
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
                "printcontent": takecode == "" ? "":takecode,
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
                "x": 600,
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
          // ordertypesearchkey:["CNC","CND","CNDT"],
          // ordertypeList:['闪电送','同城配','门店速提'],
          let orderAmt = new Number(orderItem.orderAmt)
          msg = {
            "pagewidth": 1000,
            "pageheight": 1300 + 120 * orderItem.orderItem.length,

            "data": [
              {
                "printtype": 4,
                "x": 10,
                "y": 118,
                "printcontent": orderItem.orderNo,
                "bartype": 128,
                "barrotate": false,
                "height": 60
              },
              {
                "printtype": 1,
                "x": 40,
                "y": 180,
                "printcontent": orderItem.orderNo,
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 550,
                "y": 180,
                "printcontent": distributor,
                "fontSize": 2,
                "rotate": 0,
                "bold": 3,
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
                "printcontent": orderItem.channelCodeCN,
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
                "printcontent": orderItem.orderDate,
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
                "printcontent": orderItem.expressName,
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
                "printcontent": orderItem.logisticsExpressNo,
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
                "printcontent": orderItem.expectedDeliveryTime,
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
                "printcontent": orderItem.allowOutStockPick?"":"单价",
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
                "printcontent":  orderItem.allowOutStockPick?"":"金额",
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
                "y": (h * orderItem.orderItem.length) + 510 + 140,
                "printcontent": orderItem.allowOutStockPick? "":"共计",
                "fontSize": 2,
                "rotate": 0,
                "bold": 1,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 35 + 80 + 120 + 380 + 70 + 70 - 10,
                "y": (h * orderItem.orderItem.length) + 510 + 140,
                "printcontent": orderItem.allowOutStockPick? "":orderAmt.toFixed(2),
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              },
              {
                "printtype": 1,
                "x": 25,
                "y": (h * orderItem.orderItem.length) + 510 + 230,
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
                "starty": (h * orderItem.orderItem.length) + 510 + 100 + 230 + 60,
                "endx": 800,
                "endy": h * Number(orderItem.orderItem.length) + 510 + 100 + 230 + 60,
                "fullline": false
              },




            ]
          }


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
          if(orderItem.allowOutStockPick&&this.orderFrom!="DBD"){
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
                "printcontent": takecode == "" ? "":takecode,
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
          for (let a = 0; a < orderItem.orderItem.length; a++) {
            console.log('orderItem.orderItem[a].itemName----',orderItem.orderItem[a].itemName)

            let orderQty = orderItem.orderItem[a].orderQty
            let actualPrice = new Number(orderItem.orderItem[a].actualPrice)
            let singleAmount = Number(orderItem.orderItem[a].orderQty) * Number(orderItem.orderItem[a]
              .actualPrice)

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
            } else if (l == 3) {
              singlealignnum = singlealignnum - 20

            } else if (l >= 4) {
              singlealignnum = singlealignnum - 25

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
            } else if (c == 3) {
              amountalignnum = amountalignnum - 15

            } else if (c >= 4) {
              amountalignnum = amountalignnum - 25

            }

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
              "printcontent": orderItem.orderItem[a].itemNo,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 - 30,
              "y": h * a + 510 + 60 + 50,
              "contentWidth": 280+ (orderItem.orderItem.allowOutStockPick ? 100:0),
              "contentHeight": 900,
              "printcontent": orderItem.orderItem[a].itemName,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": orderItem.orderItem.allowOutStockPick? 0 :35 + 80 + 120 + 350 - 10 + singlealignnum,
              "y": orderItem.orderItem.allowOutStockPick? 0 :h * a + 510 + 60 + 50,
              "printcontent": orderItem.allowOutStockPick? "": new Number(orderItem.orderItem[a].actualPrice).toFixed(2),
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 + 380 + 70 - 10,
              "y": h * a + 510 + 60 + 50,
              "printcontent": orderItem.orderItem[a].afterQty>=0?orderItem.orderItem[a].afterQty:orderItem.orderItem[a].orderQty ,
              "fontSize": 2,
              "rotate": 0,
              "bold": 0,
              "reverse": false,
              "underline": false
            }, {
              "printtype": 1,
              "x": 35 + 80 + 120 + 380 + 70 + 70 - 10 + amountalignnum,
              "y": h * a + 510 + 60 + 50,
              "printcontent": orderItem.allowOutStockPick? "":singleAmount.toFixed(2),
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
          if (orderItem.orderFrom.startsWith("TM_SM")) {
            qrcode = 6
            changecode = 6

          } else if (orderItem.orderFrom.startsWith("DBD")) {
            qrcode = 7
            changecode = 7

          } else if (orderItem.orderFrom == "京东") {
            qrcode = 2
            changecode = 2
          } else if (orderItem.orderFrom == "京东到家") {
            qrcode = 5
            changecode = 2
          } else if (orderItem.orderFrom.startsWith("云店")) {
            qrcode = 4
            changecode = 5

          } else if (orderItem.orderFrom == "美团" || orderItem.orderFrom == "饿了么") {
            changecode = 4
          } else if (orderItem.orderFrom.startsWith("莴笋") || orderItem.orderFrom.startsWith("试用瓶")) {
            changecode = 3
          }else if (orderItem.orderFrom.startsWith("天猫") ) {
            qrcode = 1
            changecode = 2
          }


          if(changecode==7){

        }else if(changecode!=6){
            msg.data.push({
            "printtype": 1,
            "x": 200,
            // "y": (h * this.pickinglist.length) + 510 + 100 + 200,
            "y": (h * orderItem.orderItem.length) + 510 + 100 + 200 + 100,
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
            "y": (h * orderItem.orderItem.length) + 510 + 100 + 200 + 150,
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
            "y": (h * orderItem.orderItem.length) + 510 + 100 + 200 + 100,
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
            "y": (h * orderItem.orderItem.length) + 510 + 100 + 200 + 150,
            "printcontent": `尊敬的顾客，如您对订单有任何疑问，请用天猫或淘宝APP扫描下方猫超二维码`,
            "fontSize": 2,
            "rotate": 0,
            "bold": 0,
            "reverse": false,
            "underline": false
          }, )
          }
          if(qrcode == 6){
              msg.data.push({
                "printtype": 1,
                "x": 350,
                "y": h * orderItem.orderItem.length + 510 + 390 + 110,
                "printcontent": "猫超客服二维码",
                "rotate": 0,
                "fontSize": 2,
                "qrver": 2,
                "qrlel": 0,
              }, {
                "printtype": 3,
                "x": 350,
                "y": h * orderItem.orderItem.length + 510 + 390 + 150,
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
                "y": h * orderItem.orderItem.length + 510 + 390 + 110,
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
                "y": h * orderItem.orderItem.length + 510 + 390 + 150,
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
                "y": h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
                "printcontent": "https://a.app.qq.com/o/simple.jsp?pkgname=com.watsons.mobile",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },

              {
                "printtype": 1,
                "x": 375,
                "y": h * orderItem.orderItem.length + 510 + 390 + 110,
                "printcontent": "满99减25",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 300,
                "y": h * orderItem.orderItem.length + 510 + 390 + 150,
                "printcontent": "扫码发关键字【优惠券】领取",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 350,
                "y": h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
                "printcontent": "http://weixin.qq.com/q/029BuWYvgjbo_10000M07I",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },

              {
                "printtype": 1,
                "x": 640,
                "y": h * orderItem.orderItem.length + 510 + 390 + 110,
                "printcontent": "如需申请电子发票",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 640,
                "y": h * orderItem.orderItem.length + 510 + 390 + 150,
                "printcontent": "请扫下方二维码",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 640,
                "y": h * orderItem.orderItem.length + 510 + 390 + 150 + 60,
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
                "y": h * orderItem.orderItem.length + 510 + 390 + 110,
                "printcontent": "扫码获取更多优惠资讯",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              }, {
                "printtype": 3,
                "x": 350,
                "y": h * orderItem.orderItem.length + 510 + 390 + 150,
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
                "y": h * orderItem.orderItem.length + 510 + 390 + 150,
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
                "y": h * orderItem.orderItem.length + 510 + 390 + 150,
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
                "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 100,
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
                "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150,
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
                "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150 + 50,
                "printcontent": "http://weixin.qq.com/q/02zpFu4SqAb5T10000007i",
                "rotate": 0,
                "qrver": 2,
                "qrlel": 0,
              },



              {
                "printtype": 1,
                "x": 580,
                "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 100,
                "printcontent": "屈臣氏会员",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 1,
                "x": 520,
                "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150,
                "printcontent": "超值权益，一年省超￥800",
                "fontSize": 2,
                "rotate": 0,
                "bold": 0,
                "reverse": false,
                "underline": false
              }, {
                "printtype": 3,
                "x": 550,
                "y": h * orderItem.orderItem.length + 50 + 510 + 390 + 150 + 50,
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

    },
    mounted() {


      this.initbackground()
      this.initchannelchoice()
      //   this.getpickdata("", true)
      //   this.getAPPDate()
      this.sendMsg()
      this.init()
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

  .ButtonGroup {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .pocketnum {}

  #pickbutton {
    background: #42b983;
    color:
      #fff;
  }

  .goodsTipsButton {
    /* display: inline-block; */
    float: left;
    width: 100%;
    height: 3rem;
    box-sizing: border-box;
    line-height: 3rem;
    background: #FAE100;
    color: #000;
    text-align: center;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
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
    background: url('../../assets/checkbox.png') center center no-repeat;
    background-size: 1rem auto;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    margin: 0 0.5rem;
  }

  .nocheck {
    background: url('../../assets/nocheckbox.png') center center no-repeat;
    background-size: 1rem auto;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    margin: 0 0.5rem;
  }

  .unfunctiontype {
    color: #009E96;
    padding-left: 1rem;
    font-size: 0.85rem;
    height: 1rem;
    line-height: 0.9rem;
  }

  .functiontype {
    padding-left: 1rem;
    font-size: 0.85rem;
    height: 1rem;
    line-height: 0.9rem;
  }



  .getmoredata {
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
    background: url('../../assets/checkbox.png') center center no-repeat;
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
    background: #f2f2f2;
    padding-bottom: 3rem;
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

  /* 缺货提示 */
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
  .tmallTips{
    font-size: 0.9rem;
    padding-bottom: 1rem;
    color: red;
  }

  .underline {
    width: 100%;
    height: 1px;
    background: #e2e2e2;
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

</style>
