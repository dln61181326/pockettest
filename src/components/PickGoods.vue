<template>
    <div class="index">
        <!-- <nav class="navbar navbar-inverse navbar-fixed-top top"> -->
        <nav class="navbar navbar-inverse navbar-fixed-top title" id="bar">
            <!-- <img class="backPoint clearfix:after" src="../assets/backPoint.png"  @click="$router.back(-1)"> -->
            <img class="backPoint clearfix:after" src="../assets/backPoint.png"  @click="goBack()">

   <div id="title"class="titlename" >提货</div>
   <img class="cameraIcon"  @click="showcamerascan()" v-if="showCamera" src="../assets/cameraIcon.png" >

   <div class="clearfix"></div>
        </nav>

<div id="DetailsTitle" class="navbar navbar-inverse navbar-fixed-top ">
    <div class="orderlist" >
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
              <!-- 2019-07-07 11:33:48 -->
              <div class="bookingTime">预约取货时间：{{orderDate}}</div>
              <div id="checkstate"class="checkstate">{{checkstate}}</div>
            </div>

        </div>

      </div></div>


          <div id="third">
              <div class="orderlist" >
                <!--  v-for="(dataList,index) in orderItem" -->
                <!-- @click="showScanPocketstate=!showScanPocketstate" -->
                  <div  class="orderlistContent"  v-if="goodlist4show(index)"  v-for="(dataList,index) in pickinglist">
                    <div class="goodslist1">
                      <div class="goodsordernum">{{dataList.itemNo}}</div>
                      <div class="goodsmoudle">{{dataList.planogram_id}}</div>
                      <!-- v-if="moudleismore(index)" -->
                      <span :id="forId(index)" class="moreplanogram" @click="showgoodsmoudle(index,$event)">...</span>
                      <!-- v-bind:class="[starArr[index]==5 ? choosestar : nochoosestar]" -->
                      <!-- <input v-if="false" class="clearfix:after":id="goodsstateforId(index)"  v-bind:class="[goodsstate[index] ? pickinggoodsstate : okgoodsstate ]" v-model="goodsstateText[index]" readonly="readonly"></input> -->

                      <div class="clearfix"></div>

                    </div>
                    <div class="goodslist2" >
                      
                      <div class="orderName">{{dataList.itemNameZht}}</div>
                      <div class="goodsprice clearfix:after">    x
                          <span class="quantityCount">{{dataList.orderQty}}</span>
                          </div>
                      <div class="clearfix"></div>
                    </div>
                    <div class="goodslist3" :id="goodslist3(index)" v-if="false">
                      <span class="scanCount">扫描数量</span>
                       <span class="cut" @click="cutCount(index)">-</span>
                        <input class="count" type="number" v-on:blur="onbl(index)" v-on:focus="inputfocus(index)"  v-model="goodsCount[index]" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
                        <span class="add" @click="addCount(index)">+</span>

                        <div class="goodlist4" v-if="false"  @click="closeselecttips(index)" >
                            <span>{{dataList.reasonText}}</span>
                            <!-- <input   v-model="shortpickreasontext[index]" readonly="readonly"></input> -->
                            <img class="goodlist4point " src="../assets/backPoint.png"  >
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

            <div id="pickbutton"class="goodsTipsButton clearfix:after" v-if="keyboardshow"  @click="totakegoods()">提货</div>
              <div class="clearfix"></div>

          </div>

            <div class="maskBoxblack TipsMask" v-if="showScanPocketstate" >
              <span class="TipsBox maskBox" >
                <div class="PocketDiv">
                  
                  <div class="PocketTitle">
                     请扫描袋号
                  </div>
                  <input type="text" class="PocketNum"onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
                  <div id="closePocketDiv" @click="showScanPocketstate=!showScanPocketstate">
                      <img class="closeImg " src="../assets/backPoint.png" >
                  </div>
                </div>
                  </span>
                  </div>



                  <div v-if="showselectstate"class="spec-menu" >
                    <div class="spec-menu-box">
                      <div class="spec-menu-middle">
                        <div class="nature-box">
                          <div class="pro-att clear">
                            <span class="spec-tit">缺货原因:</span>
                            <!-- v-for="(dataList,index) in changnnellistCN" -->
                            <img class="closeselect " src="../assets/close.png"  @click="closeselecttips('a')">

                            <p >
                              <span :id="getreasonid(1)" @click="selectReason(1)">库存缺货</span>
                              <span :id="getreasonid(2)"  @click="selectReason(2)">近效期或破损</span></p></p>
                          </div>
                        </div>
                      </div>
                      <!-- /规格、属性 -->
                      <!-- 按钮 -->
                      <div class="spec-menu-btn clear">
                        <span href="#" class="confirmSelect" @click="choicereason()"    >确定</span>
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
    name: 'HelloWorld',
    data () {
      return {
        showselectstate:false,
        goodsCount:[],
        changnnellist:["","WS","WSMT","WSELM","TM","JD","JDDJMZ","JDDJYD","VM","7LK","JK","BASTORE","PZ","MYSTORE","ZCS_TB","OTHER",'TM_SM'],
        changnnellistCN:["全部","莴笋自营","莴笋美团","莴笋饿了么","天猫商城","京东商城","京东到家美妆","京东到家药店","自动售货机","七乐康平台","平安好医生","云店","积分商城","云店2.0","试用瓶","其他","天猫超市"],
        readypicking:false,
        keyboardshow:true,
        planogram:[],
        picklistitem:[],
        Shortage:{},//缺货字段
        expectedDeliveryTime:store.state.orderItem.expectedDeliveryTime,
        orderAmt:store.state.orderItem.orderAmt,
        orderNo:store.state.orderItem.orderNo,
        goodsmoudlecount:true,
        goodstotalcount:0,
        planogramId:[],
        selectReasonoption:"",
        showCamera:true,
        // planogramId:['12002C05C3/421.0000',"12002C05C3/421.0000"],
        orderDate:store.state.orderItem.orderDate,
        orderFrom: store.state.orderItem.channelCodeCN==undefined?"未知渠道":store.state.orderItem.channelCodeCN,
        scanbarcode:"",
        ordertotalcount:0,
        shortpickreasontext:[],
        // shortpickreasontext:"缺货原因",
        p360itemcode:"",//
        orderlockstate:"",
        checkstate:"", //捉取sendState 拣货状态
        tipsstate:"",
        selectindex:"",
        goodsstate:[],
        reasonselect:[],
        pickinggoodsstate:"pickinggoodsstate",
         okgoodsstate:"okgoodsstate",
         goodsstateText:[],
         reasonarr:["1001","1002"],
        showScanPocketstate:false,
        orderItem:store.state.orderItem,
        pickinglist:store.state.orderItem.orderItem
      }
    },

    methods: {
      goBack(){
        var that = this
      // if(this.readypicking){
          layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '确定离开？'
            ,skin : "demo-class"
            ,btn: ['确定', '取消']
            ,yes: function(index){
              Router.push({name:'PickOrderList'}) 
              layer.close(index);
            },no: function(index){
              layer.close(index);
            }
          });
          that.tipscss()
      // }else{
      //   Router.push({name:'PickOrderList'}) 

      // }
      },
      unlockList:function(orderNo,lockId){
        
                  var url =store.state.runurl+"/watsons/rest/gateway/kms/onstore/admin/common/order/unlockPick";
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
              if(res != null&& res!=""&&res.code!=null&&res.code == "0"){
                // store.state.orderItem =   this.orderlist[i]
                // this.sendlockList(this.orderlist[i].orderNo,i)
                //  this.picking = res.data.orderItem.length
              }else if(res.code==403){
                var that =   this
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
        layer.msg('解锁订单失败，请联系管理员');

      })
            },
      backTopPage(){
      
      },
      inputfocus(i){
        this.keyboardshow=false
        this.$set(this.goodsCount, i, "");
      },
      forId:function(index){
				return "forid_" +index
      },

      goodsstateforId(index){
        return "goodsstateforId" +index
      },


      tipscss(){
        $(".layui-layer-btn1").css("border","none")
          $(".layui-layer-btn0").css("border","none")
          $(".layui-layer-btn0").css("border","none")
          $(".layui-layer-btn0").css("background","#009E96")
          $(".layui-layer-close2").css("display","none")
      },


      closeselecttips(i){
        this.readypicking = true
        if(i!="a"){this.selectindex = i}
        this.showselectstate = !this.showselectstate
      },

      choicereason(){
// 1.把当前选了reason的itemlist，加入reason，加入已拣数量，放进缺货list中
// 2.
//    
      this.closeselecttips('a')
      this.$set(this.pickinglist[this.selectindex],"reason", this.selectReasonoption)
      if(this.selectReasonoption=="1001"){
        this.$set(this.pickinglist[this.selectindex],"reasonText","库存缺货")
        this.$set(this.pickinglist[this.selectindex],"reason","1001")

      }else if(this.selectReasonoption=="1002"){
        this.$set(this.pickinglist[this.selectindex],"reasonText","近效期或破损")
        this.$set(this.pickinglist[this.selectindex],"reason","1002")


      }
      // var t = this.pickinglist[this.selectindex]

      },

      selectReason(i){
        $("#reasonid"+i).attr('class','on');
        if(i>1){
          $("#reasonid"+1).removeClass("on");
          // this.$set(this.shortpickreasontext,i,"近效期或破损")
        }else{
          $("#reasonid"+2).removeClass("on");
          // this.$set(this.shortpickreasontext,i,"库存缺货")

        }

        i = i-1
        console.log("reasonid========="+i)
        this.selectReasonoption  = this.reasonarr[i]
     
        
      },

      goodlist4show:function(index){
        if(this.pickinglist[index].itemFlag=="D"){
          return   false
          }else{
            return true
          }

      },

      getreasonid(i){
        return "reasonid"+i
      },

      
      goodslist3:function(index){
     
				return "goodslist3" +index
      },

      canshowCount:function(){
        for(var count = 0;count<this.pickinglist.length;count++){
        if(this.pickinglist[count].itemFlag == "D"){
         //把免拣货的数量== 库存数量           例如 购物袋x200   邮费x1
         $("#goodslist3"+count).css("display","none")
       }
      }
   },
   
      
      moudleismore:function(index){
        // console.log("this.pickinglist[index].planogram_id============="+this.pickinglist[index].planogram_id)
        // return false
        if(this.planogramId!=null&&this.planogramId.length>1){

          return true
        }else{
          return false

        }
      },

      showcamerascan(){
        let msg = this.msg
        var phoneType = window.sessionStorage.phoneType
        if(phoneType=="android"){
              this.$bridge.callHandler('scanCodeCall',msg,(res)=>{
    })
            }else{
              this.$bridge.callHandler('callScan', msg, (res) => {
	  // 处理返回数据
	})
              // this.IOSgetScanCode()
            }
      
      },
    
      getAPPDate(){
       
        var that = this
        if(store.state.phonetype=="ios"){
          
        this.$bridge.registerHandler('scanResult', (data, responseCallback) => {
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
      responseCallback(data)
    })
    
  }

        this.$bridge.registerHandler('scanCallback', (data, responseCallback) => {
      // alert('app主动调用js方法，传入数据:'+ data)
      // alert("//"+data)
      var result = false
      var count = 0
         for(var i =0;i<this.pickinglist.length;i++){
          //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
     if(that.pickinglist[i].store_barcode.indexOf(data) != -1){
      result = true
      count = i
     }
         }  
         
         if(result){that.addCount(count)}else{        layer.msg('货号不匹配，请重扫');
           }
      responseCallback(data)
    })
        
   if(store.state.phonetype=="urovo"||store.state.phonetype=="TC51"||store.state.phonetype=="UBX"||store.state.phonetype=="DT50"){

   
    this.$bridge.registerHandler('redScanCodeCall', (data, responseCallback) => {
      // alert('app主动调用js方法，传入数据:'+ data)
      // alert("//"+data)
      var result = false
      var count = 0
         for(var i =0;i<this.pickinglist.length;i++){
          //  console.log("this.pickinglist[i].item======="+this.pickinglist[i].item)
     if(that.pickinglist[i].store_barcode.indexOf(data) != -1){
      result = true
      count = i
     }
         }  
         
         if(result){that.addCount(count)}else{        layer.msg('货号不匹配，请重扫');
           }
      responseCallback(data)
    })
  }

    this.$bridge.registerHandler('userGoBack', (data, responseCallback) => {
             console.log("CloseWebView====================")
    })
    // this.$bridge.registerHandler('userKeyBack', (data, responseCallback) => {
    //                 console.log("userKeyBack====================")

    // })
   

  },
  sendMsg(){
    let msg = this.msg
    if(store.state.phoneType=="urovo"||store.state.phoneType=="TC51"||store.state.phoneType=="UBX"||store.state.phonetype=="DT50"){

    
    this.$bridge.callHandler('redScanCodeCall',msg,(res)=>{
      // alert('获取app响应数据:'+res)
      this.test = res
    })
  }else if(store.state.phoneType == undefined || store.state.phoneType == ""){
    this.$bridge.callHandler('redScanCodeCall',msg,(res)=>{
      // alert('获取app响应数据:'+res)
      this.test = res
    })
  }
    this.$bridge.callHandler('userKeyBack',msg,(res)=>{
      // alert('获取app响应数据:'+res)
      // this.test = res
    })
  
  },

  
  showgoodsmoudle:function(index,event){
    
    var planogramIdtemp =""
    if(this.planogramId[index].length>=1){
      for(var i = 0;i<this.planogramId[index].length;i++){
        if(i==0){
          planogramIdtemp = this.planogramId[index][i]
        }else{

          planogramIdtemp = planogramIdtemp +"</br>"+this.planogramId[index][i]
        }
        // planogramIdtemp.push("</br>")
      }
     
    }
    // this.pickinglist[index].planogramId
    console.log("planogramIdtemp=========="+planogramIdtemp)
    // console.log("=========event.currentTarget.target.id+index;"+event.target.id+index)
    var tips = layer.tips(planogramIdtemp, "#"+event.target.id, {
      tips: [4, '#000'],time:5000
});
  },

      pickinginit:function(){
        var totalcount = 0 
        for (var i = 0; i <this.pickinglist.length;i++) {
          
          if(this.pickinglist[i].itemFlag=="D"){
            this.goodsstateText.push("")
           
          }else{
            this.goodsstateText.push("待提货")
            this.$set(this.pickinglist[i],"reasonText","缺货原因")
            var count =  this.pickinglist[i].orderQty
         totalcount =           Number(totalcount) + Number(count) 
          }
          this.goodstotalcount++
          this.goodsstate.push(true)
          this.goodsCount.push(0)
          
         

        }   

        this.goodstotalcount = totalcount
        
      },

            pickingPocket:function(orderNo){
              layer.load(2);
              // http://10.82.25.197:8081
              // var url ="http://10.82.26.249:8888/onstore/admin/order/toTake/takeConfirm";

                  var url =store.state.runurl+"/onstore/admin/order/toTake/takeConfirm";
                  var t = store.state.token
                  var d  = {'orderNo':orderNo,'deliveryGoodsCode':store.state.deliveryGoodsCode,'channelCode':store.state.channelCode}
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
            ,content: '核销完成'
            ,skin : "demo-class"
            ,btn: ['好的']
            ,yes: function(index){
              Router.push({name:'Message'}) 

              layer.close(index);
            }
          });

          this.tipscss();
                  // layer.msg('核销完成');
                  store.state.beforePickOrderNum = orderNo
                  this.readypicking = false
              }else if(res.code==403){
                var that =   this
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
                layer.msg('提货核销失败，请重试');
              }

              // 提示用户已经拣货完毕，弹出对话框，然后后返回到上一页
            },function (res) {
        //失败之后处理逻辑
        //loadding取消
        //提示无数据
        layer.closeAll('loading')
        layer.msg('提货核销异常，请联系管理员');

      })
            },
         

   
            
      
      toDetail:function(){
        Router.push({name:'PickOrderList'}) 

      },
      resetbackground:function(){
      
var h =   $(window).height()
       var topheight = $(".title").height()
       var DetailsTitle = $("#DetailsTitle").height()

       
       h = h - DetailsTitle - topheight
       // h=h*0.9
       $("#third").css("height",h*0.85)
//        $(".index").css("height",h*0.7)
},
      // showScanPocket:function(){
         
      // },

      getProductByItemCode:function(){
        // http://10.82.25.197:8081
       var  u  =  store.state.runurl+  "/watsons/rest/gateway/p360/api/getAppointProductByItems"
  var codeList = []
   for(var i = 0;i<  this.pickinglist.length;i++){

     codeList.push(this.pickinglist[i].itemNo)
   }
 var data =  {
    // "storeNo":store.state.storeNum,
    "storeNo":store.state.storeNum,

    codeList,
    "fieldList":["product_image","product_base","product_comments","store_price","product_ma","product_osd","product_planogram","product_mc","product_med","product_cb","product_property"]
        }
        var that = this
        axios.post(u,data).then(res=>{
        console.log(res)
        if(res.data.is_success){
                        //找到对应的商品，然后显示
                        //1.无陈列号    2.有一个陈列号      3有多个陈列号
                        // 1. 无就补""    即可
                        // 2. 有一个则 赋值到 planogram
                        var planogram = []
                        var product_baselist =[]
                        //  res.data.data.product_base.product_base
                        for(var i =0;i<res.data.data.product_list.length;i++){
                        planogram.push(res.data.data.product_list[i].product_planogram)
                        product_baselist.push(res.data.data.product_list[i].product_base)
                        this.$set(this.pickinglist[i],"item", planogram[i].item)
                        // this.pickinglist[i].planogram_idarr = []
                        //如果product_planogram 数组>1   push进去
                        if(planogram[i]!=""&&planogram[i]!=undefined&&res.data.data.product_list[i].itemCode==this.pickinglist[i].itemNo){//对比当前列的itemno 和拿到的itemno是否相同
                          //无论有多少个
                          this.$set(this.pickinglist[i],"planogram_id", planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)

                          // if(planogram[i][0].planogram_id!=null&&planogram[i][0].planogram_id.length>1){
                          //   this.pickinglist[i].planogram_idarr.push(planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)

                          // }else  
                          // // ====旧代码=======================
                          // if(planogram[i][0].planogram_id!=null&&planogram[i][0].planogram_id.length>0){
                          //   this.$set(this.pickinglist[i],"planogram_id", planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)

                          // }
                          // ============================================================
                         
                          if(planogram[i]!=null&&planogram[i].length>1){
                            var rearr = []
                              for(var q=0;q<planogram[i].length;q++){
                                var re = planogram[i][q].planogram_id+planogram[i][q].plan_level+planogram[i][q].plan_seq+planogram[i][q].plan_Facing
                               
                                rearr.push(re)
                             
                                $("#forid_"+i).css("display","inline-block");     
                                // forId
        //                         if(this.pickinglist[i].itemFlag=="D"){
        //                           $("#forid_"+i).css("display","none");          
        // }else{
         
        //   $("#forid_"+i).css("display","inline-block");

        // }

                              }
                              this.planogramId.push(rearr)
                              var a = this.planogramId
                          console.log("planogramId======="+a)
                          }else{
                            this.$set(this.pickinglist[i],"planogram_id", planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)
                            this.planogramId.push(planogram[i][0].planogram_id+planogram[i][0].plan_level+planogram[i][0].plan_seq+planogram[i][0].plan_Facing)
                          }

                       
                        }else {
                          this.$set(this.pickinglist[i],"planogram_id", "")
                          this.planogramId.push("")
                        }
                      
                        if(product_baselist[i].store_barcode==""||product_baselist[i].store_barcode==undefined){
                          this.$set(this.pickinglist[i],"store_barcode", "")

                        }else{
                          this.$set(this.pickinglist[i],"store_barcode", product_baselist[i].store_barcode)

                        }

                        
                      
                      // console.log("  this.pickinglist[i].store_barcode======="+  this.pickinglist[i].planogram_id)

                        // var pickinglisttemp = that.pickinglist
                        // console.log("planogram============"+planogram)
                        // for(var i =0;i<)
                        // this.pickinglist
                        }
                            
                        // for(var i =0;i<res.data.data.product_base.length;i++){

                        
                        // }
                       
                     }else{
                       //提示货品不匹配，无法拣货
                       layer.msg('货品条码获取不成功，请联系管理员');

                     }
})
      },


gopicking(){
  var b
  for(var a =0;a<this.pickinglist.length;a++){

    if(this.pickinglist[a].orderQty !=this.goodsCount[a]&&this.pickinglist[a].itemFlag!="D"){
      layer.msg("数量有误，请重新检查")
      return
    }else{
      b = true

    }
  }
  if(b){
    // layer.msg("准备拣货")
    var that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '您确定提货？'
            ,skin : "demo-class"
            ,btn: ['确定', '取消']
            ,yes: function(index){
              // location.reload();
              that.pickingPocket(that.orderItem.orderNo)

              layer.close(index);
            }
          });
          that.tipscss()

  }

},

onbl:function(index){
  this.readypicking=true
  this.keyboardshow = true
  var havereason = false
  var c = this.goodsCount[index]
for(var a =0;a<this.pickinglist.length;a++){
  if(this.pickinglist[a].reason!=undefined==this.pickinglist[a].reason==null){havereason=true}else{havereason=false}

}

  if(this.pickinglist[index].orderQty ==c&&havereason){
          //颜色变绿色
            //标识完成
            this.$set(this.goodsstateText, index, "完成");
            this.$set(this.goodsstate, index, false);
            this.totakegoods()
          }else if(this.pickinglist[index].orderQty <c||this.goodsCount[index]==""){
            this.$set(this.goodsCount, index, 0);

            layer.msg("数量有误，请重新输入")
          }
         
  console.log("this.goodsCount[index]======"+this.goodsCount[index])
  
},

totakegoods(){
  // var topicking = false
  // // console.log("c======"+c)
  // // this.$set(this.goodsCount, index, c--);
  // for(var i = 0;i<this.goodsCount.length;i++){
  //            if(this.pickinglist[i].itemFlag=="D"||this.goodsCount[i] ==this.pickinglist[i].orderQty){
  //              topicking = true
  //            }else{
  //             topicking = false
  //             i = this.goodsCount.length+1
  //            }
  //           }
     
  // if(topicking){
    var that =   this
              layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '您确定提货？'
            ,skin : "demo-class"
            ,btn: ['确定', '取消']
            ,yes: function(index){
              // location.reload();
              that.pickingPocket(that.orderItem.orderNo)

              layer.close(index);
            }
          });
          that.tipscss()

  // }
},


      addCount:function(count){
        this.readypicking = true
        // this.$set(this.starArr, index, score);
        if(this.pickinglist[count].itemFlag != "D"){
        var c = this.goodsCount[count]
        var picktatal=0
        var addordertotalcount = 0
        var cangopicking =false
        if(this.pickinglist[count].orderQty ==c){
          
            
          layer.msg('货品已够数量');
        }else{
          console.log("=========goodsCount==============="+c)
         c++
        this.$set(this.goodsCount, count, c);
        if(c>this.pickinglist[count].orderQty){
          layer.msg('货品已够数量');
        }
          if(this.pickinglist[count].orderQty ==c){
          //颜色变绿色
            //标识完成
            this.$set(this.goodsstateText, count, "完成");
            this.$set(this.goodsstate, count, false);
          }
          console.log("picktatal============"+picktatal)

          this.totakegoods()

        }
       
      }
          
      },
      
      goDown(){
        console.log("==========leave===")
      },

      init(){
        var w  =   $(window).height()

        var a  =   $(".orderlist").height()
        var ButtonGroup  =   $(".ButtonGroup").height()
        var DetailsTitle  =   $("#DetailsTitle").height()
        var title  =   $(".title").height()
       a =  parseInt(w)-parseInt(ButtonGroup) - parseInt(DetailsTitle) - parseInt(title)
      $(".third").css("height",a)
      console.log(" initbackground========="+a )
       if(store.state.phonetype==undefined||store.state.phonetype==""||store.state.phonetype==null||store.state.phonetype=="urovo"||store.state.phonetype=="TC51"||store.state.phonetype=="UBX"||store.state.phonetype=="DT50"){
         this.showCamera = false
       }
      // },
      if(store.state.beforePickOrderNum == this.orderNo){
        
        layer.open({
                title:'',
                className: 'pickingTips'
            ,content: '当前提货单已操作，请不要重复操作'
            ,skin : "demo-class"
            ,btn: ['确定']
            ,yes: function(index){
              Router.push({name:'PickOrderList'}) 
                layer.closeAll()
            }
          });
          this.tipscss()
      }
      },
      
      cutCount:function(count){
        var c = this.goodsCount[count]
        console.log("=========goodsCount==============="+c)
        if(c>0)
        this.$set(this.goodsCount, count, c-1);
        this.$set(this.goodsstate, count, true);
        this.$set(this.goodsstateText, count, "待拣货");

      },

      showgoods:function(){
       var p =  this.pickinglist
        for(var i = 0;i<p.length;i++){
          // if(p[i].)
        }
      }

    },
  //   beforeRouteLeave(to, from, next) {
  //   layer.closeAll()
  // },
    mounted() {
      if (window.history && window.history.pushState) {
    history.pushState(null, null, document.URL);
    // window.addEventListener('popstate', this.goBack, false);
  }
     // }
    //  store.state.orderItem =  this.orderlist[i]
  console.log(" store.state.channelCode========="+ store.state.channelCode)

    console.log("deliveryGoodsCode======="+store.state.deliveryGoodsCode)
      this.resetbackground()
      this.pickinginit();
      this.getProductByItemCode()
      this.getAPPDate();
      this.sendMsg()
      this.canshowCount();
      this.init()
      this.showgoods();

    },
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
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
  .orderlistContent{
    padding-bottom: 0.7rem;
    border-bottom: 1px solid #EFEFF4;
  }
.closeImg{
  display: block;
  width: 1rem;
    transform: rotate(-90deg);
}
.closeselect{
display: inline-block;
    margin-top: 0.2rem;
    float: right;
    width: 1.7rem;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }
.searchFixedList{
  background: #fff;
  padding-left:1rem;
}

.goodsmoudle{
  width: 45%;
  font-size: 0.8rem!important;
  color: #8d8d8d!important
}



.PocketNum{
  width: 80%;
    margin: .5rem auto;
    height: 1.5rem;
    background: #F2F2F2;
    border-radius: 0.3rem;
    border: none;
    display: block;
}
.orderName{
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
.goodsprice{
  float: right;
  color: #9d9d9d;
    padding-right: 1rem;
}
  .thirdTitle{
    float: left;
    font-size: 1.7rem;
      margin-bottom: 0.3rem;
  
  }
  #third{
    background: #fff;
    overflow: auto;
  }

  .goodslist1 div{
    display: inline-block;
   
  }
  .list1 div{
    display: inline-block;
    /* padding-left: 1rem; */
    font-weight: 600;
  }
  .quantity{
    position: relative;
    left: 3.2rem;
    font-size: 0.7rem;
    color: #9d9d9d;
    padding-right: 1rem;
  }
  .goodlist4 img{
    float: right;
    margin-top: 0.4rem;
  }

  .cameraIcon{
    float: right;
    padding-right: 1rem;
    padding-top: 0.9rem;
    width: 1.3rem;
  }

  .quantityCount{
    font-size: 0.9rem;
  }
  .goodsordernum, 
  .goodsmoudle
   {
    font-weight: 600;

  }
  .goodsordernum{

  width: 25%;
  }

  .ordernum{
    float: left;
    padding-left: 1rem;
    font-size: 1.2rem;
  }
  .price{
    /* padding-right: .5rem; */
    float: right;
  }
  .count{
    width: 3rem;
    border: none;
    margin: 0 0.2rem;
    text-align: center;
  }
  .channelText{
    color: #FFBD2F;
    margin-left: 1rem;
    padding: 0.1rem 0.3rem;
    margin-bottom: .5rem;
    border-radius: 0.2rem;
    margin-right: 1rem;
    border: 1px solid;
    font-size: 0.6rem !important;
  }
  .orderDate{
    /* float: right; */
    width: 53%;
    color: #9d9d9d;
  }
  #pickbutton{
    background: #42b983;
    color: #fff;
    width: 100%;
  }
  .list2 div{
    display: inline-block;
    font-size: 0.8rem;
  }
  .list1{
    margin-bottom: 0.5rem;
    padding-top: 0.5rem;
  }
  .orderlist{
    /* padding-bottom: 0.8rem;
    border-bottom: 1px solid #f2f2f2; */
  }
  .totalcount{
  }
  .titlename{
    font-weight: 600;
    width: 50%;
    height: 2rem;
    line-height: 3rem;
    margin: auto;
    display: inline-block;
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
  .goodlist4point{
    width: .4rem;
    display: inline-block;
    transform:rotate(-90deg)
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
  .pickinggoodsstate{
    border: none;
    float: right;
    width: 12%;
    padding-right: 1rem;
    padding-top: 0.5rem;
    text-align: right;
    color: #FFBD2F;
    font-size: 0.8rem;
  }
  .okgoodsstate{
    border: none;
    float: right;
    width: 11%;
    padding-right: 1rem;
    padding-top: 0.5rem;
    text-align: right;
    color: #4ACC6B;
  }

  .ButtonGroup{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  #secondTitle{
    margin: 0.5rem 0 ;
  }
  .searchKey{
    margin-top: 1rem;
  }
  .goodlist4{
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
    background: #9d9d;
    color: #fff;
    text-align: center;
    margin-top: 1rem;
    margin-right: 1rem;
  
  }
  .list3 div{
    
    display: inline-block
  }
  .list3{
    color: #9d9d9d;
    padding-left: 0.8rem;

  }
  .goodsNum{
    width: 30%
  }
  .goodstype{
    width: 20%;
    color: #37ACD5;
  }
  .checkstate{
    color: #FFBD2F;
    font-size: 0.9rem;
  }
  .bookingTime{
    width: 79%;
    color: #3193F7;
    font-size: 0.8rem;
  }
  .searchlistcheckBox{
    padding: 0.4rem;
    font-size: 0.9rem;
    border-bottom: 1px solid #f2f2f2;
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
  .totalprice{
    padding-right:.5rem ;
    float: right;
  }
  .placeIcon{
    float: left;
    width: 1.5rem;
  }
  #countTips{
    height: 3rem;
      line-height: 4rem;
  }
  .goodsTipsButton{
    /* display: inline-block; */
    float: left;
    /* width: 50%; */
    height: 3rem;
    box-sizing: border-box;
    line-height: 3rem;
    background: #FAE100;
    color: #000;
    text-align: center;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  #DetailsTitle{
    background: #E6E6E6;
    /* padding: 0.5rem; */
  }
  .title{
    height: 3rem;
    line-height: 1.9rem;
    text-align: center;
    background: #fff
  }
  .backPoint{
    width: 4.5%;
    position: absolute;
    left: 1rem;
    top: 1rem;
  }
  .scanCount{
    font-size:0.9rem;
    color:#9d9d9d;
  }
  .searchInput{
    border: none;
    background: #F2F2F2;
    height: 2rem;
    border-radius: 0.6rem;
    padding-left: 1rem;
    width: 78%;
  }
  .codeIcon{
    width: 1rem;
    position: relative;
    right: 2rem;
    top: 0.2rem;

  }
  #channel{
    padding-bottom: 1rem;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 1rem;
  }

  .goodslist1,.goodslist2,.goodslist3{
    padding-left: 1rem;
    /* height: 1.7rem; */
    line-height: 1.7rem;
   
  }

   .goodsordernum,.goodsmoudle{
     
     font-size: 0.9rem;
   }
   .add{
    width: 1rem;
   }
   .cut{
    margin-left: 1rem;
    width: 1rem;
   }
   .Button{
    /* margin-top: 1rem;
    margin-bottom: 1rem; */
   }
  .searchButton{
    color: #9d9d9d;
    float: right;
    font-size: 0.9rem;
    width: 10%;
    padding-top: 0.4rem;
    padding-right: 0.6rem;
  }
  .PocketDiv{
    background: #fff;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    
  }
  #closePocketDiv{
    width: 100%;
    height: 3rem;
    line-height: 3.7rem;
    border-top: 1px solid #F2F2F2;
    text-align: center;
  }
  .PocketTitle{
    height: 2.5rem;
    line-height: 2.5rem;
    margin: auto;
  }

  /*弹框*/
  .maskBoxblack{
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



.index{
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

  .spec-menu .spec-menu-box{
  position: fixed;
    bottom: 0;
    width: 100%;
    height: 52%;
    background-color: #fff;
    border-top: 1px solid #dadada;
    z-index: 250;
  }
  .spec-menu .spec-menu-up{
  width: 100%;
    height: 84px;
    position: relative;
    border-bottom: 1px solid #ededed;}
    .spec-menu .spec-menu-middle{
      position: absolute;
    bottom: 43px;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 10px;
    overflow: auto;
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
  