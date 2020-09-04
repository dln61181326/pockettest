<template>
    <div class="index">

      <nav class="navbar navbar-inverse navbar-fixed-top top">
                    <loadding  v-if="showstate"></loadding>  

        <div class="title" >    
            <img class="backPoint clearfix:after" src="../../assets/backPoint.png"  @click="toMessage()">
   <div class="titlename" >{{listtitle}}</div>
   <div class="clearfix"></div>
</div>
<!--  class="navbar navbar-inverse navbar-fixed-top"  -->
<div id="searchBox">
    <img class="codeIcon" src="../../assets/noglasses.png" >
  <input class="searchInput"type="text" v-model="dn" @keyup.enter="getcancelorder(dn,false)" v-on:blur="resetbackground()"placeholder="支持输入或扫描订单号">
  <img class="camera"  @click="showcamerascan()" v-if="showCamera" src="../../assets/cameraIcon.png" >

  <div class="searchButton" @click="getcancelorder(dn,false)">搜索</div>
  <div class="clearfix"></div>
</div>

<div id="" class="searchKey">
  <div id="searchOrderType">
    <span @click="channelSearch">订单类型:{{orderlistSearchKey}}</span>

    <img id="searchkeystateImg" class="channelImg " src="../../assets/backPoint.png">

  </div>

</div>
        </nav>

        <div class="searchlist" v-if="searchstate">
            <!-- 订单类型 -->
        <div class="maskBoxblack TipsMask" v-if="searchstate">
          <span class="TipsBox maskBox">
            <div class="searchFixedList">
              <div class="searchlistcheckBox" :id="checkBoxId(index)" v-for="(dataList,index) in changnnellistCN"
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
          <div id="third">
                      <div v-if="datasiNull" class="datatips">请输入正确的订单号</div>

              <div class="orderlist" >
                  <div class="orderlistContent" v-for="(dataList,index) in orderlist" @click="toDetail(index)">
                    <div class="list1">
                      <div class="ordernum" v-if="orderlistSearchKey!='changnnellistCN[0]'">{{dataList.orderNo  }}</div>
                      <div class="ordernum" v-if="orderlistSearchKey=='changnnellistCN[0]'">{{dataList.wlNo}}</div>
                      <!-- <div  class="count">数量:{{dataList.orderLtem.length}}</div> -->

                      <div class="price clearfix:after">￥{{dataList.orderAmt}}</div>
                      <div class="clearfix"></div>

                    </div>
                    <!-- <div class="list2">
                      <div class="channelTextDiv clearfix:after"">
                      <div class="channelText">{{dataList.channelCodeCN}}</div></div>
                      <div class="orderDate clearfix:after"">{{dataList.orderDate}}</div>
                      <div class="clearfix"></div>

                    </div> -->
                    <div class="list1">
                      <div class="channelTextDiv ordernum clearfix:after">
                      <div class="channelText"> {{dataList.channelCodeCN==undefined?"未知渠道":dataList.channelCodeCN}}</div></div>
                      <div class="orderDate price clearfix:after">{{dataList.orderDate}}</div>
                      <div class="clearfix"></div>

                    </div>
                    <div  v-if="showpackagestate"class="packagestate">
                      <span class="packagestatetxt">包装是否有损坏？</span>
                      <span v-bind:class="[packageStateArr[index] == true ? choicestate : unchoosestate ]" @click="choicepackageState(index)"></span>

                      </div>
                    
                    <div v-if="false"  class="">
                      <div class="buttongroup clearfix:after">
                        <span id="reasonbutton" class="  orderbutton"@click="showreasonBox(index)">{{dataList.reason}}</span>
                        <span id="cancelbutton" class="  orderbutton" @click="returnorderchoice(index,dataList.reason)">退回货物</span>
                        <div class="clearfix"></div>
                      </div>
                    </div>
                    <div v-if="cancelorder"  class="">
                      <div class="buttongroup clearfix:after">
                        <span id="reasonbutton" class="  orderbutton"@click="showreasonBox(index)">{{dataList.reason}}</span>
                        <span id="cancelbutton" class="  orderbutton" @click="cancelorderchoice(index,dataList.reason)">取消订单</span>
                        <div class="clearfix"></div>
                      </div>
                    </div>
                  </div>

                 
  
                </div>
                          <div class="getmoredata" v-if="loadmorestate" @click="getmoredata()">加载更多</div>
                          <div class="getmoredata nodata" v-if="havenodatastate">已经无数据了....</div>

                </div>
                <div v-if="showselectstate"class="spec-menu" >

                  <div class="spec-menu-box">
                    <div class="spec-menu-middle">
                      <div class="nature-box">
                        <div class="pro-att clear">
                          <span class="spec-tit">订单取消原因：</span>
                          <img class="closeselect " src="../../assets/close.png"  @click="showselectstate=false">
                        </div>
                      </div>
                    </div>
                    <!-- /规格、属性 -->
                    <!-- 按钮 -->

                    <div class="returnBox" >
                      <div id="customreturn"class="list"v-for="(reason,index) in reasonlist" @click="selectreason(index)">
                        <span class="listcontent">
                        <span class="thirdTitle ">{{reason}}</span>
                        <img class="point" src="../../assets/point.png">
                        <div class="clearfix"></div>

                      </span>
                    </div>
      
                </div>
                    
                    </div>
                    <div class="spec-menu-btn clear">
                      <span href="#" class="confirmSelect" @click="showreasonBox()"    >确定</span>
                    </div>
                    <!-- /按钮 -->
                  </div>
                </div>
          </div>
    </div>
    
  </template>
  
  <script>
    import $ from 'jquery'
    import Router from "../../router/index";
      import store from '../../vuex/store';

  export default {
    name: 'HelloWorld',
  //  components: {     //引用重复页面模块
  //           loadding:loaddingVue,
  //       },  
    data () {
      return {
        searchkeystate:true,
        windowheight:"",
        choicestate: 'all',
        choosechannel: 'all',
        unchoosechannel: 'nocheck',
         datasiNull:false,
         page:1,
         showpackagestate:false,
         packageStateArr:[],
         reasonselectindex:0,
         unchoosestate: 'nocheck',
         pagenum:1,
         Selectchannel:"全部",
         showselectstate:false,
         dataorderbystate:store.state.sort,
         channneltitle:"全部渠道",
        searchstate:false,
        channelCode:"",
        dataisnull:false,
        channelArr: [],
        reasonArr:[],
        showCamera:true,
        totalCountstate:false,
        totalCount:"",
        dn:"",
        msg:"",
        showreasonb:true,
        returnGoods:false,
        cancelorder:false,
        loadmorestate:false,
        loadmorekepp:1,
        havenodatastate:false,
        showstate: false,
        choicereason:"理由",
        nodatastate:false,
        // orderlistdata:[],
        orderlist:[],
        orderlistdata:[],
        listtitle:"退货入库列表",
        reasonlist:[],
        changnnellist:["","WS","WS_MT","WS_ELM","TM","JD","JDDJ_MZ","JDDJ_YD","VM","7LK","JK","BASTORE","PZ","ZCS_TB","MYSTORE",'TM_SM'],
        orderfromlistCN:[],
        changnnellistCN:["退仓单号/快递单号","原订单号"],
        ordertypeArr: [],
        orderlistSearchKey: "退仓单号/快递单号",
        // ddlist:{"code":0,"data":{"msg":"操作成功","code":0,"data":{"msg":"订单查询成功！","orderType":"CND","orderNo":"893941579000070045","discount":"","allReturnNum":1,"orderAmt":49.0,"shipName":"林","hasreturning":0,"shipMobile":"15768315515","itemnum":1,"allPrice":41.0,"reg":1,"itemja":[{"itemId":"8aaab9f6165848f68cac1d6a25aedc74","actualPrice":41.0,"returnNum":1,"itemNameZht":"欧莱雅男士控油炭爽净亮洁面膏100毫升","index":1,"returnSupport":"Y","itemNo":"100261401","returnPrice":41.0,"barcode":""}],"cncOrder":true,"success":true,"payment":"","orderFrom":"MYSTORE","deliveryWay":"闪电购","orderDate":"2020-02-11","status":"已签收"}},"msg":"成功"}
      }
    },
//     destroyed(){
//   window.removeEventListener('popstate', this.goback(), false);//false阻止默认事件
// },


    methods: {
      initchannelcnlist(){
        let s = "../static/channelList/channelListCn.json";
    if (this.$store.state.env == "0") {
      s = "../../KMS/static/channelList/channelListCn.json";
    }
    this.$axios.get(s).then(
      res => {
        console.log(res.data)
        this.orderfromlistCN = res.data;
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
      OrderTypeSearchOK(i) {
        this.searchstate = !this.searchstate
        this.SearchKeyStateChange()
        this.orderlist = []
        this.getcancelorder(this.dn, false)
      },
      initordertype(){
        for (var a = 0; a < this.changnnellistCN.length; a++) {
          if (a == 0) {
            this.ordertypeArr.push(true)
          } else {

            this.ordertypeArr.push(false)
          }
        }
      },
      Selectordertype(i) {
        // console.log("orderlistSearchKey========"+this.ordertypeList[i])
        // if(i!=undefined&&i!=""){

        this.orderlistSearchKey = this.changnnellistCN[i]
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
      SearchKeyStateChange: function () {
        if (this.searchkeystate) {
          $("#searchkeystateImg").css("transform", "rotate(-90deg)")

        } else {
          $("#searchkeystateImg").css("transform", "rotate(90deg)")
          $("#channelImg").css("transform", "rotate(-90deg)")
          this.searchstate = false

        }

        this.searchkeystate = !this.searchkeystate



      },
      channelSearchOK(i) {
        this.channelSearch()
        this.orderlist = []
        this.getcancelorder(this.dn, false)
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
      handleScroll(e){
        let viewHeight =$("#third").height();//可见高度  

      let contentHeight =$("#third").get(0).scrollHeight;//内容高度  

         let scrollHeight =$("#third").scrollTop();//滚动高度  

        if(contentHeight - viewHeight < scrollHeight) { 

                this.getmoredata()

        }  
      },
      checkBoxId(i){
            return "checkBox"
            // return "checkBox"+i

      },
      selectreason(i){
       this.orderlist[this.reasonselectindex].reason  = this.reasonlist[i]
       let r = this.reasonlist
      //  let reason =  this.orderlist[this.reasonselectindex].reason
      if(store.state.returnParam==1){
        store.state.returnreason  = this.reasonlist[i]
        
        console.log("returnreson======="+store.state.returnreason)
      }
       this.showselectstate = false
      },

      Selectchanne(i){
        // console.log("index========"+i)
        if(i!=undefined&&i!="")
        this.Selectchannel = this.changnnellistCN[i]
      },
      goback(){
        Router.push("Message")
      },

      choicepackageState (index){
        this.$set(this.packageStateArr, index, !this.packageStateArr[index]);
      },
          showcamerascan(){
             let phoneType = window.sessionStorage.phoneType
            let msg = this.msg
            if(phoneType=="android"){
              this.$bridge.callHandler('scanCodeCall',msg,(res)=>{//安卓扫一扫功能
    })
            }else{
              this.$bridge.callHandler('callScan', msg, (res) => {//苹果扫一扫功能
	  // 处理返回数据
	})
              // this.IOSgetScanCode()
            }
    },

		
      getAPPDate(){
       let that = this
       
       this.$bridge.registerHandler('scanResult', (data, responseCallback) => {//苹果扫一扫功能
        alert("data==="+data)
        if(data!=""){
          that.dn = ""
            that.dn=data
            that.getpickdata(that.dn,false)
          } 
    
         responseCallback(data)
       })
   this.$bridge.registerHandler('scanCallback', (data, responseCallback) => {//安卓扫一扫功能
        
    if(data!=""){
      that.dn = ""
        that.dn=data
        // that.getpickdata(that.dn,false)
      }

     responseCallback(data)
   })

   this.$bridge.registerHandler('redScanCodeCall', (data, responseCallback) => {
        
        if(data!=""){
          that.dn = ""
            that.dn=data
            that.getpickdata(that.dn,false)
          }
    
          //  alert(data)
         responseCallback(data)
       })
 },

 cancelorderchoice(index,returnReason){
   let id = this.orderlist[index].id
  //  let returnReason = returnReason
   if(returnReason=="理由"){
    layer.msg('请选择退货理由');

      return
   }
   let that = this

  layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '是否确认取消该订单'
            ,skin : "demo-class"
            ,btn: ['是的','取消']
            ,yes: function(index){
              let packState
              if(that.packageStateArr[index]){packState=1}else{packState=0}
              that.goCancelOrder(id,returnReason,packState)

              layer.close(index);
            },no: function(index){
              layer.close(index);
            }
          });

          this.tipscss()
 },

goCancelOrder:function(id,returnReason,packState){
              layer.load(2);
              // http://10.82.25.197:8081
              // let url ="http://10.82.26.249:8888/onstore/admin/order/toTake/takeConfirm";

                  let url =store.state.runurl+"/onstore/admin/order/express/orderlist";
                  let t = store.state.token
                  let d  = {'id':id,'returnReason':returnReason,'packState':packState,"storeNo":this.$store.state.storeNum,"returnRemark":""}
                  $.ajax({
              type: 'POST',
            url:url,
            data:d,
            datatype:"json",
            headers:{
                "Token":t,
                'Content-Type':'application/x-www-form-urlencoded'

            }
            }).then((res)=>{
              layer.closeAll('loading')

              if(res.code==0){
                  //提示
                  layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '操作完成'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: (index) =>{
              // Router.push({name:'Message'}) 
              this.getcancelorder();
              layer.close(index);
            }
          });

          this.tipscss();
          // this.goCancelOrder();
                  // layer.msg('核销完成');
                  store.state.beforeOrderNum = orderNo
                  this.readypicking = false
              }else if(res.code==403){
                let that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '登录已过期，现准备重新登录'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              // location.reload();
              Router.push("/")

              layer.close(index);
            }
          });

          that.tipscss()
               }else if(res.code==500&&!(res.msg ==="未到预约结束时间")){
                  layer.msg('取消失败，未到预约结束时间');
               }
               else{
                layer.msg('取消失败，请重试');
              }

              
              if(this.orderlist.length>=res.data.total&&this.orderlist.length>0&&orderno==""&&oldlist.length>=this.orderlist.length){
                  this.loadmorestate =  false
                  this.havenodatastate = true
               }else if(this.orderlist.length>=res.data.total&&this.orderlist.length>0){
                this.loadmorestate =  false
                  this.havenodatastate = false
                  
               }

              // 提示用户已经拣货完毕，弹出对话框，然后后返回到上一页
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
        //提示无数据
        layer.closeAll('loading')
        layer.msg('退货操作异常，请联系管理员');

      })
            },

 toMessage(){
    Router.push("Message")
 },
 showreasonBox(index){
    this.showselectstate = true
    this.reasonselectindex = index
 },
 sendMsg(){
   let msg = this.msg
   let that = this
   console.log("getAPPDate================")
  if(store.state.phonetype=="urovo"||store.state.phonetype=="TC51"||store.state.phonetype=="UBX"||store.state.phonetype=="DT50"){

    this.$bridge.callHandler('redScanCodeCall',msg,(res)=>{
    })
  }
     // alert('获取app响应数据:'+res)

 },

searchpickdata () {
        this.orderlist = []
        this.getpickdata(this.dn,false)
},
      
      channelSearchOK (index) {
        this.channelSearch()
        this.orderlist = []
        this.getpickdata(this.dn,false)
      },

      init(){
          console.log("returnParam================"+store.state.returnParam)
          let keyarr = []
        if(store.state.returnParam ==1&& store.state.returnkeyArr.length == 0){
          this.getreasonlist()
        }else if(store.state.returnParam ==2&& store.state.expressreasonArr.length == 0){

          this.getreasonlist()
        }else if(store.state.returnParam ==3&& store.state.cancelkeyArr.length == 0){
          this.getreasonlist()
        }


         
        if(store.state.returnParam=="1"){ 
           this.listtitle = "顾客退货"
           this.returnGoods = false
           this.cancelorder = false

         keyarr =   store.state.returnkeyArr 
         this.reasonlist =   store.state.returnreasonArr 
           }else if(store.state.returnParam=="2"){  
             this.listtitle = "快递退回"
             this.returnGoods = true
                this.cancelorder = false
                 keyarr  = store.state.expresskeyArr
    this.reasonlist   =   store.state.expressreasonArr
             }else if(store.state.returnParam=="3"){ 
                this.listtitle = "取消订单"
                this.returnGoods = false
                this.cancelorder = true
                this.showpackagestate  = true

                 keyarr   =  store.state.cancelkeyArr
               this.reasonlist   =  store.state.cancelreasonArr

                }
                
        layer.closeAll('tips');//关闭所有的tips层     
        this.dn = store.state.phoneType
        // console.log("store.state.phonetype==========="+store.state.phonetype)
       if(store.state.phonetype==undefined||store.state.phonetype==""||store.state.phonetype==null||store.state.phonetype=="urovo"||store.state.phonetype=="TC51"||store.state.phonetype=="UBX"||store.state.phonetype=="DT50"){
         this.showCamera = false
       }
      this.Selectchanne(store.state.inde)
      // },
       
      },

// 降序排列
down (name) {
        return function (obj1, obj2) {
          let val1 = obj1[name]
          let val2 = obj2[name]
          val1 = val1.replace(/-/g,'/')
          val2 = val2.replace(/-/g,'/')
          let time1 = new Date(val1).getTime()
          let time2 = new Date(val2).getTime()
          return time2-time1
        }
      },
      // 升序排列
      dataorderbysort() {
        // this.orderlist.reverse();
        //  console.log("orderDate======")
        if(this.dataorderbystate){
          this.orderlist.sort(this.up('orderDate'))
        }else{
          this.orderlist.sort(this.down('orderDate'))

        }
        this.dataorderbystate = !this.dataorderbystate
        // let sortdata = this.orderlist
        
      },
      up (name) {
        return function (obj1, obj2) {
          let val1 = obj1[name]
          let val2 = obj2[name]
          val1 = val1.replace(/-/g,'/')
          val2 = val2.replace(/-/g,'/')
          let time1 = new Date(val1).getTime()
          let time2 = new Date(val2).getTime()
          let result = time1-time2
          return result
        }
      },
    
       initchannelchoice(){
        console.log(" initchannelchoice=========")

          for(let a = 0;a<this.changnnellistCN.length;a++){
            if(a==0){
              this.channelArr.push(true)
            }else{

              this.channelArr.push(false)
            }
          }
       },

      getmoredata () {
        this.pagenum = this.pagenum+1
          this.getcancelorder(this.dn,true);

      

},


// this.recommendlist.sort(this.compare(type));
            notdatasetbackground(){
 let h =   $(window).height()
              let bottomheight = $(".bottom").height()
              h = h 
              $(".orderlist").css("height",h)
                       $("#third").css("background","#F2F2F2");

                   this.orderlist = []
                   this.loadmorestate = false;
                   this.havenodatastate = true
                   this.loadmorekepp = false 
                   
            },


      
            sendlockList:function(orderNo,i){
               layer.load(2);
                  let url =store.state.runurl+"/watsons/rest/gateway/kms/onstore/admin/common/order/lockPick";
                  let t = store.state.token
                  let formData = new FormData();
                  formData.append("orderNo", orderNo)
                  let data = {
                    "orderNo": orderNo,
                        
            };
                  $.ajax({
                    type: 'post',
              data:{orderNo:orderNo},
              url:url,
              datatype:"json",
            headers:{
                "Token":store.state.token,
                'Content-Type':'application/x-www-form-urlencoded'
                

            }
            }).then((res)=>{
                   
              layer.closeAll('loading')
              // console.log("res-----------------"+res)
              if(res!=null&&res.code==0){
               store.state.orderItem =  this.orderlist[i]
               store.state.channelArr  = this.orderlist[i].channelCode
               store.state.channelCodeCN  = this.orderlist[i].channelCodeCN
               store.state.sort = this.dataorderbystate
               console.log("this.dataorderbystate======================="+this.dataorderbystate)
               Router.push({name:'PickGoods'}) 
              } else if(res!=null&&res.code==500){
                layer.msg(res.msg);
              }else if(res.code==403){
                let that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '登录已过期，现准备重新登录'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              // location.reload();
              Router.push("/")

              layer.close(index);
            }
          });

          that.tipscss()
               }
              
              else{
                layer.msg('打开订单失败，请重试');
              }
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
          //提示订单异常，请联系管理员
          
          layer.closeAll('loading')
          layer.msg('订单异常，请联系管理员');
      })
            },
      unlockList:function(orderNo,lockId,i){
        layer.load(2);
        
                  let url =store.state.runurl+"/watsons/rest/gateway/kms/onstore/admin/common/order/unlockPick";
                  let t = store.state.token
                  // let d  = {" orderNo ": "454515722619000003"}
      //             let f = new FormData();
      //             f.append("orderNo",orderNo)
      //             f.append("lockId",lockId)
      let data = {
                    "orderNo": orderNo,
                    "lockId": lockId,
                        
            };
                  $.ajax({
                    type: 'post',
              data:data,
              url:url,
              datatype:"json",
              // processData: false,
              // contentType: false,
            headers:{
                "Token":store.state.token,
                "content-type":'application/x-www-form-urlencoded'

            }
            }).then((res)=>{
              layer.closeAll('loading')
              if(res != null&& res!=""&&res.code!=null&&res.code == "0"){
                store.state.orderItem =   this.orderlist[i]
                this.sendlockList(this.orderlist[i].orderNo,i)
                //  this.picking = res.data.orderItem.length
              }else if(res.code==403){
                let that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '登录已过期，现准备重新登录'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              // location.reload();
              Router.push("/")

              layer.close(index);
            }
          });

          that.tipscss()
               }else{
                layer.msg(res.msg);

              }
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
        //提示无数据
        layer.closeAll('loading')
        layer.msg('打开订单失败，请重试');

      })
            },

      choice:function(index){
        for(let a =0;a<this.channelArr.length;a++){
          if(index==a){
            this.$set(this.channelArr, index, true);
      this.channneltitle = this.changnnellistCN[index]
          }else{
            this.$set(this.channelArr, a, false);
          }

        }
        

      },
      returnorderchoice(index,returnReason){
        let id = this.orderlist[index].id
  //  let returnReason = returnReason
   if(returnReason=="理由"){
    layer.msg('请选择退货理由');

      return
   }
   let that = this
        layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '是否确定退货该订单？'
            ,skin : "demo-class"
            ,btn: ['是的','取消']
            ,yes: function(index){
              let packState
              if(that.packageStateArr[index]){packState=1}else{packState=0}

              that.goCancelOrder(id,returnReason,packState)

              layer.close(index);
            },no: function(index){
              // location.reload();

              layer.close(index);
            }
          });

          this.tipscss()
      },
     initbackground:function(){
      this.windowheight =   $(window).height()
      $(".index").css("height",this.windowheight)
      console.log(" initbackground=========")
    },
      resetbackground:function(){
                let top =   $(".top").height()
                let w = this.windowheight
                w=w-top
                $("#third").css("height",w)

                // $("html, body").animate({
                // scrollTop: 0 }, {duration: 0,easing: "swing"});
                // this.initbackground()
              // }


      },
    //   tosearchdata(orderno,refresh){
    //     this.getcancelorder(orderno,false)
    // },

      gettotalCountstate(){
        if(store.state.totalCount>0){
          return true
        }else{
          return false
        }
      },

      getcustompickdata:function(orderno,refresh){//是否需要刷新
        // $(".searchlistcheckBox").eq(19).hide();
        let that = this
        this.datasiNull = false
        this.orderlist = [];
        let oldlist = that.orderlist
        // let channelCode="JK"
        if(orderno==undefined){
            orderno=""
        }
        layer.load(2);

        for(let a=0;a<this.changnnellist.length;a++){
          if(this.channelArr[a]){
            this.channelCode =  this.changnnellist[a]
          }
        }
//  "orderNo": "893941579000070045",
        let d = {
                    "orderNo": orderno,
                        
            };
                  let url = store.state.runurl+"/onstore/admin/kms/return/readOrder";
                // let url = "/kms"
                  let t = store.state.token
                  $.ajax({
              type: 'post',
            url:url,
            data:d,
            // datatype:"json",
            headers:{
                  "Token":t,
                  "Content-Type":"application/x-www-form-urlencoded"

            }
            }).then((res)=>{
              layer.closeAll('loading')
              let d = {}

              // if(res.code==0&&res.data!=null&&res.data.list.length>=0){

              //   this.totalCount = res.data.total
              // }

              if(res.code==0&&res.data!=null&&res.data!=undefined&&res.data!=""){
                this.loadmorestate =  true
               
                // let temorderlist = this.orderlist
               if(this.orderlist.length>0&&orderno==""&&refresh){
                  for (let i = 0; i <res.data.list.length;i++) {
                  this.orderlist.push(res.data.list[i])
                 }
                  let alist = this.orderlist

               }else{
              // this.orderlist = res.data.list
             
              d.channelCode=res.data.channelCode;
              d.orderNo=res.data.orderNo;
              d.orderDate=res.data.orderDate;
              d.orderAmt=res.data.orderAmt;
              d.orderLtem=res.data.orderLtem;

              
              this.orderlist.push(d)
              
              
               }
               let f = this.orderlist
               console.log("f================"+f)

                 //对比当前订单的 orderfrom字段 和数组中的第i个
                 for (let a = 0; a <=this.changnnellist.length;a++) {
                //  console.log("channelcode======"+this.orderlist[i].channelCode)
                //  console.log("changnnellist============"+this.changnnellist[a])

                 if(this.orderlist[0].channelCode == this.changnnellist[a]){
                  // this.$set(this.orderlist, i, "");
                  this.$set(this.orderlist[0],"channelCodeCN", this.changnnellistCN[a])

                  // this.orderlist[i].channelCodeCN =this.changnnellistCN[a]
                 } 

                 if(this.orderlist[0].channelCode =="OTHER"){
                  this.orderlist[i].channelCodeCN  = "其他"
                 }



                 }
                 if(this.orderlist.length==1){
                    this.toDetail(0);
        }
               }else if(res.code==403){
                let that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '登录已过期，现准备重新登录'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              // location.reload();
              Router.push("/")

              layer.close(index);
            }
          });

          that.tipscss()
               }
               else{
                this.loadmorestate = false
                   //提示
                   this.datasiNull = true
                  this.havenodatastate = false
                  this.orderlist = []
                  //  layer.msg('无订单...');
                  
               }
              //  this.loadmorestate =  false
              //     this.havenodatastate = false
               if(this.orderlist.length>=res.data.total&&this.orderlist.length>0&&orderno==""&&oldlist.length>=this.orderlist.length){
                  this.loadmorestate =  false
                  this.havenodatastate = true
               }else if(this.orderlist.length>=res.data.total&&this.orderlist.length>0){
                this.loadmorestate =  false
                  this.havenodatastate = false
                  
               }
               
               
               this.resetbackground()
               layer.closeAll('loading')
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
        //提示无数据
          //提示
          layer.closeAll('loading')

          layer.msg('查询数据有问题，请重试');

      })
            },
            getpackagedata:function(orderno,refresh){//是否需要刷新
        // $(".searchlistcheckBox").eq(19).hide();
        let that = this
        this.datasiNull = false
        let oldlist = that.orderlist
        // let channelCode="JK"
        if(orderno==undefined){
            orderno=""
        }
        layer.load(2);

        for(let a=0;a<this.changnnellist.length;a++){
          if(this.channelArr[a]){
            this.channelCode =  this.changnnellist[a]
          }
        }

        let d = {
                    "orderNo": orderno,
                        
            };
                  let url = store.state.runurl+"/onstore/admin/order/express/list?pageNum="+this.pagenum+"&flag=1&pageSize=10&orderNo="+orderno;
                // let url = "/kms"
                  let t = store.state.token
                  $.ajax({
              type: 'get',
            url:url,
            // datatype:"json",
            headers:{
                  "Token":t,
                  "Content-Type":"application/x-www-form-urlencoded"

            }
            }).then((res)=>{
              layer.closeAll('loading')
              // this.choicereason = "理由"
              if(res.code==0&&res.data!=null&&res.data.list.length>=0){

                this.totalCount = res.data.total
              }

              if(res.code==0&&res.data!=null&&res.data.list.length>0){
                this.loadmorestate =  true
               
                // let temorderlist = this.orderlist
               if(this.orderlist.length>0&&orderno==""&&this.orderlist[0].orderNo!=res.data.list[0].orderNo&&refresh){
                  for (let i = 0; i <res.data.list.length;i++) {
                  this.orderlist.push(res.data.list[i])
                 }
                  let alist = this.orderlist

               }else{
              this.orderlist = res.data.list

               }

               for (let i = 0; i <this.orderlist.length;i++) {
                 //对比当前订单的 orderfrom字段 和数组中的第i个
                 this.$set(this.orderlist[i],"reason","理由")
                 this.packageStateArr.push(false)

                 if(this.orderlist[i].orderItem!=null){
                this.$set(this.orderlist[i],"orderLtem",this.orderlist[i].orderItem)
              }

                 
                 for (let a = 0; a <=this.changnnellist.length;a++) {
                //  console.log("channelcode======"+this.orderlist[i].channelCode)
                //  console.log("changnnellist============"+this.changnnellist[a])

                 if(this.orderlist[i].channelCode == this.changnnellist[a]){
                  // this.$set(this.orderlist, i, "");
                  this.$set(this.orderlist[i],"channelCodeCN", this.changnnellistCN[a])

                  // this.orderlist[i].channelCodeCN =this.changnnellistCN[a]
                 } 

                 if(this.orderlist[i].channelCode =="OTHER"){
                  this.orderlist[i].channelCodeCN  = "其他"
                 }

                

                 }
                 }
            


              
              if(this.dataorderbystate){
                this.orderlist.sort(this.down('orderDate'))
               
        }else{
  

          this.orderlist.sort(this.up('orderDate'))

        }
        if(this.orderlist.length==1){
          this.toDetail(0)
        }
        // this.cancelorder = true
               }else if(res.code==403){
                let that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '登录已过期，现准备重新登录'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              // location.reload();
              Router.push("/")

              layer.close(index);
            }
          });

          that.tipscss()
               }
               else{
                this.loadmorestate = false
                   //提示
                   this.datasiNull = true
                   this.loadmorestate = false
                  this.havenodatastate = false
                  this.orderlist = []
                  //  layer.msg('无订单...');
                  
               }
              //  this.loadmorestate =  false
              //     this.havenodatastate = false
               if(this.orderlist.length>=res.data.total&&this.orderlist.length>0&&orderno==""&&oldlist.length>=this.orderlist.length){
                  this.loadmorestate =  false
                  this.havenodatastate = true
               }else if(this.orderlist.length>=res.data.total&&this.orderlist.length>0){
                this.loadmorestate =  false
                  this.havenodatastate = false
                  
               }else if(this.orderlist.length<res.data.total){
                this.loadmorestate =  true
                this.havenodatastate = false
               }
               
               
               this.resetbackground()
               layer.closeAll('loading')
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
        //提示无数据
          //提示
          layer.closeAll('loading')

          layer.msg('查询数据有问题，请重试');

      })
            },
            getretgurnorderfortmall(orderno,refresh){
              this.datasiNull = false
        let oldlist = this.orderlist
        // let channelCode="JK"
        if(orderno==undefined){
            orderno=""
        }
        layer.load(2);

        for(let a=0;a<this.changnnellist.length;a++){
          if(this.channelArr[a]){
            this.channelCode =  this.changnnellist[a]
          }
        }

        // let d = {
        //             "orderNo": orderno,
        //             "currentPage": this.pagenum,
        //             'pageSize':10
        //     };

            // console.log('store.state.url========'+store.state.url)
            //       let url = store.state.runurl+"/onstore/admin/express/orderlist";
                                                //  onstore/admin/order/express/cancelList

                                                

            //       console.log('store.state.url========'+store.state.url)
            //       // let url = store.state.runurl+"/onstore/admin/express/orderlist?currentPage="+this.pagenum+"&pageSize=10&orderNo="+orderno;
            //       let d = {
            //         "orderNo": orderno,
                        
            // };

            console.log('store.state.url========'+store.state.url)
                  let url = store.state.runurl+"/onstore/admin/express/orderlist?currentPage="+this.pagenum+"&pageSize=10&orderNo="+orderno;
                                                //  onstore/admin/order/express/cancelList
                  let t = store.state.token
                  $.ajax({
              type: 'get',
            url:url,
            // datatype:"json",
            headers:{
                  "Token":t,
                  "Content-Type":"application/x-www-form-urlencoded"

            }
            }).then((res)=>{
              console.log('res----getreturnorderfortmall',res)
              layer.closeAll()
              if(res.code==0&&res.data.data!=null&&res.data.data.length>0){
                this.loadmorestate =  true
               
                // let temorderlist = this.orderlist   
              //  if(this.orderlist.length>0&&orderno==""&&this.orderlist[0].orderNo!=res.data.data.orderNo&&refresh){
                if(this.orderlist.length>0&&orderno==""&&refresh){

                  for (let i = 0; i <res.data.data.length;i++) {
                  this.orderlist.push(res.data.data[i])
                 }
                  let alist = this.orderlist

               }else{
              this.orderlist = res.data.data

               }
              }
            })
            },
            getcancelorder:function(orderno,refresh){//是否需要刷新
        // $(".searchlistcheckBox").eq(19).hide();
        let that = this
        this.datasiNull = false
        let oldlist = that.orderlist
        // let channelC`ode="JK"
        if(orderno==undefined){
            orderno=""
        }
        layer.load(2);

        for(let a=0;a<this.changnnellist.length;a++){
          if(this.channelArr[a]){
            this.channelCode =  this.changnnellist[a]
          }
        }

        let d = {
                    "orderNo": orderno,
                        
            };

            console.log('store.state.url========'+store.state.url)
           let index=this.changnnellistCN.findIndex((value)=>value==this.orderlistSearchKey);
           let url = `${store.state.runurl}/onstore/admin/express/orderlist?currentPage=${this.pagenum}&pageSize=10&orderNo=${orderno}&status=-1`;

           if(index==0){
          url = `${store.state.runurl}/onstore/admin/express/orderlist?currentPage=${this.pagenum}&pageSize=10&expressNo=${orderno}&status=-1`
           }
                                                //  onstore/admin/order/express/cancelList
                  let t = store.state.token
                  $.ajax({
              type: 'get',
            url:url,
            // datatype:"json",
            headers:{
                  "Token":t,
                  "Content-Type":"application/x-www-form-urlencoded"

            }
            }).then((res)=>{
              layer.closeAll('loading')
              //  res =  this.ddlist
               console.log("res======="+res.code)
              // if(res.code==0&&res.data!=null&&res.data.list.length>=0){

              //   this.totalCount = res.data.total
              // }

              if(res.code==0&&res.data.data!=null&&res.data.data.length>0){
                this.loadmorestate =  true
               
                // let temorderlist = this.orderlist   
              //  if(this.orderlist.length>0&&orderno==""&&this.orderlist[0].orderNo!=res.data.data.orderNo&&refresh){
                if(this.orderlist.length>0&&orderno==""&&refresh){

                  for (let i = 0; i <res.data.data.length;i++) {
                  this.orderlist.push(res.data.data[i])
                 }
                  let alist = this.orderlist

               }else{
              this.orderlist = res.data.data

               }

               for (let i = 0; i <this.orderlist.length;i++) {
             //对比当前订单的 orderfrom字段 和数组中的第i个
             this.$set(this.orderlist[i],"reason","理由")
             this.packageStateArr.push(false)

              // let o =  this.orderlist
                 if(this.orderlist[i].orderItem!=null){
                this.$set(this.orderlist[i],"orderLtem",this.orderlist[i].orderItem)
              }
                 for (let a = 0; a <=this.changnnellist.length;a++) {
                //  console.log("channelcode======"+this.orderlist[i].channelCode)
                //  console.log("changnnellist============"+this.changnnellist[a])

                 if(this.orderlist[i].channelCode == this.changnnellist[a]){
                  // this.$set(this.orderlist, i, "");
                  this.$set(this.orderlist[i],"channelCodeCN", this.orderfromlistCN[a])

                  // this.orderlist[i].channelCodeCN =this.changnnellistCN[a]
                 } 

                 if(this.orderlist[i].channelCode =="OTHER"){
                  this.orderlist[i].channelCodeCN  = "其他"
                 }

                

                 }
                 }

              
              
              if(this.dataorderbystate){
                this.orderlist.sort(this.down('orderDate'))
               
        }else{
  

          this.orderlist.sort(this.up('orderDate'))

        }

        // this.cancelorder = true
               }else if(res.code==403){
                let that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '登录已过期，现准备重新登录'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              // location.reload();
              Router.push("/")

              layer.close(index);
            }
          });

          this.tipscss()
               }
               else{
                this.loadmorestate = false
                   //提示
                   this.datasiNull = true
                   this.loadmorestate = false
                  this.havenodatastate = false
                  this.orderlist = []
                  //  layer.msg('无订单...');
                  
               }

               if(this.orderlist.length>=res.data.total&&this.orderlist.length>0&&orderno==""&&oldlist.length>=this.orderlist.length){
                  this.loadmorestate =  false
                  this.havenodatastate = true
               }else if(this.orderlist.length>=res.data.total&&this.orderlist.length>0){
                this.loadmorestate =  false
                  this.havenodatastate = false
                  
               }else if(this.orderlist.length<res.data.total){
                this.loadmorestate =  true
                this.havenodatastate = false
               }

              
               this.resetbackground()
               layer.closeAll('loading')
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
        //提示无数据
          //提示
          layer.closeAll('loading')

          layer.msg('查询数据有问题，请重试');

      })
            },
            getreasonlist:function(){//是否需要刷新
        // $(".searchlistcheckBox").eq(19).hide();
        let that = this
        let getreasonparam = ""
        if(store.state.returnParam ==2){
          getreasonparam = 'EXPRESS_BACK'
        }else if(store.state.returnParam ==1){
          getreasonparam = 'RETURN_REASON'
        }else{
          getreasonparam = 'ORDER_CANCEL'
        }

        let d = {
                    "name": getreasonparam,
                        
            };
                  let url = this.$store.state.runurl+'/onstore/admin/kms/dict/getValue';
                  let t = this.$store.state.token
                  $.ajax({
              type: 'post',
            url:url,
            data:d,
            // datatype:"json",
            headers:{
                  "Token":t,
                  "Content-Type":"application/x-www-form-urlencoded"

            }
            }).then((res)=>{
              layer.closeAll('loading')
              //  res =  this.ddlist
               console.log("res======="+res)
              // if(res.code==0&&res.data!=null&&res.data.list.length>=0){

              //   this.totalCount = res.data.total
              // }
let keyarr = []
              if(res.code==0){
                for (let key in  res.data) {
    // console.log(key);     //获取key值
    // console.log( res.data[key]); //获取对应的value值
    keyarr.push(key)
    this.reasonlist.push( res.data[key])
}


if(store.state.returnParam ==2){
          store.state.expresskeyArr = keyarr
    store.state.expressreasonArr =   this.reasonlist
        }else if(store.state.returnParam ==1){

          store.state.returnkeyArr = keyarr
    store.state.returnreasonArr =   this.reasonlist
        }else{
          store.state.cancelkeyArr = keyarr
store.state.cancelreasonArr =   this.reasonlist
        }
          //   for (let property in res.data)
          //     this.reasonlist.push(res.data[property]);
               
          //  store.state.reasonArr =   this.reasonlist

          //      console.log('list======='+list)
               }else if(res.code==403){
                let that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '登录已过期，现准备重新登录'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              // location.reload();
              Router.push("/")

              layer.close(index);
            }
          });

          that.tipscss()
               }

               
               
               this.resetbackground()
               layer.closeAll('loading')
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
        //提示无数据
          //提示
          layer.closeAll('loading')

          layer.msg('查询数据有问题，请重试');

      })
            },
      tipscss(){
        $(".layui-layer-btn1").css("border","none")
          $(".layui-layer-btn0").css("border","none")
          $(".layui-layer-btn0").css("border","none")
          $(".layui-layer-btn0").css("background","#009E96")
          $(".layui-layer-close2").css("display","none")
      },
      toDetail:function(i){  
        // 锁定状态（0：未锁，1：已锁）
        this.$router.push({
            path: "CustomerReturnGoodsDetailForTmall",
            query: {
              rid: this.orderlist[i].rid,
              orderFrom: this.orderlist[i].channelCodeCN,
              orderlistSearchKey:this.orderlistSearchKey
            }
          })
        },
       
       
        


      channelSearch:function(){
        if( this.searchstate){
          $(".channelImg").css("transform","rotate(-90deg)")

        }else{
          $(".channelImg").css("transform","rotate(90deg)")

        }
       this.searchstate=! this.searchstate
  
       //
      //  $(".searchlistcheckBox").hide()

      //  console.log("==checkBox18============")

        
      },

            },

    mounted() {
      this.initbackground()
      this.initchannelchoice()
      this.initordertype()
     this.getAPPDate()
      this.sendMsg()
      this.init()
      this.initchannelcnlist()
        this.initchannelenlist()
      this.getcancelorder("",false)
    },

  }

  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->x
  <style scoped>
  h1, h2 {
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
  .packagestate{
    width: 100%;
     display: flex;
  }
  .packagestatetxt{
    width: 21rem;
    text-align: right;
  }

  .all{
    background: url('../../assets/checkbox.png') center center no-repeat;
        background-size: 1rem auto;
        height: 1rem;
    width: 1.5rem;
    display: inline-block;
    margin-right: 0.5rem;
  }
  .nocheck{
    background: url('../../assets/nocheckbox.png') center center no-repeat;
        background-size: 1rem auto;
        height: 1rem;
    width: 1.5rem;
    display: inline-block;
    padding-top: 0.3rem;
    margin-right: 0.5rem;
  }
  .getmoredata{
    text-align: center;
    height: 3rem;
    line-height: 2.8rem;
    font-size: 1rem;
    background: #fff;
  }
.channelImg{
  width: 0.7rem;
    transform: rotate(-90deg);
}
.searchFixedList{
    background: #fff;
    padding-left: 1rem;
    overflow: auto;
    height: 15rem;
    padding-top: 0.3rem;
}
.top{
  background: #fff;
  position: fixed;
    width: 100%;
}
  .thirdTitle{
    float: left;
    font-size: 1.7rem;
      margin-bottom: 0.3rem;
  
  }
  .totalCount{
    width: 2rem;
  }
  .list1 div{
    display: inline-block;
    /* padding-left: 0.7rem; */
  }
  .ordernum{
    width: 59%;

  }

  
.datatips{
  width: 100%;
    color: #777777;
    text-align: center;
    background: #EFEFF4;
    font-size: 1rem;
    padding: 1rem 0;
}
.channelTextDiv{
  width: 8rem;
  /* display: inline-block; */
  float: left;
}
  .channelText{
    color: #FFBD2F;
    margin-left: 1rem;
    display: inline-block;
    line-height: 1.1rem;
    padding: 0.1rem 0.7rem;
    text-align: center;
    margin-bottom: .5rem;
    border-radius: 0.2rem;
    border: 1px solid;
    font-size: 0.6rem
  }
  .orderDate{
    font-size: 1rem;
    color: #9d9d9d;
    font-weight: 400;
    float: right;
    padding-top: 0.3rem;
  }
  .list1{
    height: 1.7rem;
    font-weight: 600;
    line-height: 1.6rem;
  }
  .orderlist{
    /* background: #fff; */
    overflow-y: auto; 
    -webkit-overflow-scrolling: touch;
  }
  .description{
    right: 1rem;
    top: 1rem;
    font-size: 0.9rem;
    position: relative;
    color: #9d9d9d;
    float: right;
  }
  .point{
    width: 1rem;
    padding-left: 0.3rem;
    padding-top: 0.9rem;
  }
  .orderlistContent{
    margin: 0.8rem;
    padding: 0.5rem;
    background: #fff;
    border-radius: 0.6rem; }
  .pickingtotal{
    color: #EC7259;
  }
 
  .list{
    margin-top: 2rem;
    padding-bottom: 1rem;
  }
  .ClickIcon{
    float: left;
    width: 2.8rem;
    margin-right: 1rem;
  }
  #third{
    padding-top: 8rem;
    overflow:auto;
    background: #EFEFF4;
  }
  .index{
    background: #EFEFF4;

  }
  #secondTitle{
    margin: 0.5rem 0 ;
  }
  .nodata{
        color: #777777;
        background: #f2f2f2;
  }
  .searchKey{
    display: flex;
    justify-content: left;
  }
   .counts,#countTips{
    color: red;
   }
  #count{
    width: 100%;
    text-align: center;
    margin: auto;
    background: #EBF5FD;
    border-radius: 1rem;
    padding: 1rem 0;
    color: #9d9d9d;
  }
  .searchlistButton{
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
  .searchlistcheckBox{
    padding: 0.4rem;
    font-size: 0.9rem;
  }

  
  .listcontent{
    border-bottom: 1px solid;
    width: 85%;
    height: 3.4rem;
    margin-left: 4rem;
  }
  #one,#two,#three{
    display: inline-block;
    width: 32%;
    box-sizing: border-box;
  }
  #first{
    font-size: 0.9rem;
    height: 3rem;
  }
  
  .placeIcon{
    float: left;
    width: 1.5rem;
  }
  #countTips{
    height: 3rem;
      line-height: 4rem;
  }

  .titlename{
    font-weight: 600;
    width: 50%;
    height: 2rem;
    line-height: 3rem;
    margin: auto;
  }
  .title{
    height: 3rem;
    line-height: 1.9rem;
    text-align: center;
  }
  .backPoint{
    width: 4.5%;
    padding-left: 1rem;
    padding-top: 0.8rem;
    float: left;
  }
  .searchInput{
    border: none;
    background: #F2F2F2;
    height: 2rem;
    border-radius: 0.6rem;
    padding-left: 2rem;
    width: 69.5%;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
  .codeIcon{
    width: 1rem;
    position: relative;
    left: 2rem;
    top: 0.2rem;

  }
  .orderby{
    padding-right: 1rem;
    float:right;
    width: 1rem;
    display: inline-block;
  }
  #channel{
    padding-bottom: .4rem;
    padding-left: 1rem;
    font-size: 0.85rem;
    height: 1.5rem;
    line-height: 0rem;
    border-bottom: 1px solid #f2f2f2;
    /* margin-bottom: 1rem; */
  }

.price{
  float: right;
  padding-right: 1rem;
}
  .searchButton{
    color: #000;
    float: right;
    font-weight: 600;
    position: relative;
    top: 0.4rem;
    right: 1rem;
  }
  .camera{
    position: absolute;
    right: 4.8rem;
    width: 1.3rem;
    top: 3.3rem;
  }

  /*弹框*/
  .maskBoxblack{
    position: fixed;
    top: 7.4rem;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239,239,244, 1);
    line-height: 100%;
    z-index: 99999;
    /* text-align: center; */
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

  .showLoadding{
  display: block;
}
.disshowloadding{
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
    position:absolute;
    width: 1.2rem;
    height: 16px;
    border: 1px solid #A6A6A6;
    border-radius: 50%;
    background-color:#FAE100;
} 
.Checkbox:checked+label:after {
    content: "";
    position: absolute;
    left: 2px;
    top:2px;
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
#cancelbutton{
  background: #009E96;
    color: #fff;
}

/* 退货 取消按钮 */
.buttongroup{
  font-weight: normal;
    display: inline-block;
    height: 2rem;
    /* line-height: 1rem; */
    margin-top: 0.4rem;
    padding-top: 0.7rem;
    padding-right: 1rem;
    width: 100%;
    border-top: 1px solid #F0F0F0;
}
.orderbutton{
  height: 1.7rem;
    line-height: 1.7rem;
    text-align: center;
    border: 1px solid #009E96;
    border-radius: 0.4rem;
    color: #009E96;
    margin: 0 0.7rem;
    width: 4rem;
    font-size: 0.9rem;
    padding: 0 0.5rem;
    float: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 选项提示 */
   .spec-menu{
    display: block;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    /* z-index: 200; */
  }
  .moreplanogram{
    display: none;
  }

  .returnBox{
    /* margin-top: 3rem; */
  }
  .spec-menu .spec-menu-box{
  position: fixed;
    bottom: 0;
    width: 100%;
    height: 52%;
    background-color: #fff;
    border-top: 1px solid #dadada;
    z-index: 250;
    overflow: auto;
  }
  .spec-menu .spec-menu-up{
  width: 100%;
    height: 84px;
    position: relative;
    border-bottom: 1px solid #ededed;}
    .spec-menu .spec-menu-middle{
      /* position: absolute;
    bottom: 43px;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 10px;
    overflow: auto; */
    padding-left: 1rem;
    }
    .spec-menu .spec-menu-middle .prod-spec{
      height: auto;
    padding-top: 12px;
    padding-bottom: 15px;
    }
    .spec-menu .spec-menu-middle .nature-box .pro-att{
      margin-bottom: 13px;
    overflow: hidden;
    position: relative;
    }
    .spec-menu .spec-menu-middle .spec-tit{
      display: inline-block;
    line-height: 2rem;
    font-size: 1rem;
    color: #999;
    height: 2rem;
    /* float: left; */
    margin-top: 3px;
    }
    .spec-menu .spec-menu-middle .nature-box .pro-att p .on{
      border: 1px solid #009E96;
    color: #009E96;
    }
    .spec-menu .spec-menu-middle .nature-box .pro-att p span{
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
    .spec-menu .spec-menu-btn{
      width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    }
    .spec-menu .spec-menu-btn .confirmSelect{
      background-color: #009E96;
    }
    .spec-menu .spec-menu-btn span{
      display: none;
    height: 44px;
    width: 100%;
    font-size: 14px;
    line-height: 44px;
    color: #fff;
    text-align: center;
    float: left;
    }
    .closeselect{
display: inline-block;
    margin-top: 0.2rem;
    float: right;
    width: 1.7rem;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }
  .list{
    height: 3rem;
    line-height: 4rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #EFEFF4;
    width: 90%;
    margin: auto;
  }
  .listcontent{
    height: 3.4rem;
  }
  .point{
    width: 1rem;
    padding-left: 0.3rem;
    padding-top: 2.1rem;
    position: absolute;
    right: 0.7rem;
  }
  .thirdTitle{
    font-size: 1.1rem;
      margin-bottom: 0.3rem;
  
  }
  #searchOrderType {
    padding-bottom: .4rem;
    padding-left: 1rem;
    font-size: 0.85rem;
    height: 1.5rem;
    line-height: 0rem;
    border-bottom: 1px solid #f2f2f2;
    /* margin-bottom: 1rem; */
  }
  </style>
  