<template>
  <div class="loginbutton" >
      <div  v-if="loginstate">请再试</div>
      <div id="loadtxt"></div>
    <loadding  v-if="loaddingstate"></loadding>  
    <div class="maskBoxblack TipsMask" v-if="true"  >
        <span class="TipsBox maskBox">
            
         <div class="errorcontent">{{errormasktipscontent}}</div>
     
      </span>
    </div>
  </div>
</template>

<script>

import Router from "../router/index";
import store from '../vuex/store';
import loaddingVue from './loadding';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import  {encrypt}  from '../../static/toolsjs/Aescrypto'


export default {
  name: 'HelloWorld',
  data () {
    return {
     loginstate:false,
     urlparam:"",
     passr:"",
     loaddingstate:false,
     eno:"",
     teststate:false,
     errorTipsmask:false,
     errormasktipscontent:""
    }
  },
  components: {     //引用重复页面模块
    loadding:loaddingVue
  
        },  
   methods: {
     cancelgoBack(){
       let msg = 1
      this.$bridge.callHandler('cancelgoback', msg, (res) => {
            // alert('获取app响应数据:'+res)
          })
     },
     getlogin(t){
      layer.load(2);
      this.cancelgoBack()
           var that  = this

                  let LS = window.sessionStorage
                  if(store.state.cempno ==null||store.state.cempno==undefined||store.state.cempno==""){
                    store.state.cempno = this.$route.query.cempno
                  }

                 
                  if(store.state.cempno ==null||store.state.cempno==undefined||store.state.cempno==""){
                    
                    store.state.cempno= LS.getItem("cempno")
                  }
                
           var empnor = encrypt(store.state.cempno,t)
          // 
          var passr = encrypt(this.passr,t)
          
        // var url  = store.state.runurl+"/watsons/rest/gateway/kms/onstore/admin/login"
        var url  = store.state.runurl+"/onstore/admin/login"

        var data = {
                    "username": empnor,
                    "password":passr
                        
            };
        $.ajax({
              type: 'post',
            url:url,
            dataType: "json",
            data:data,
            Headers:{'Content-Type': 'text/html;charset=utf-8'}
            }).then((res)=>{
              // console.log(empno)
              layer.closeAll('loading')

            if(res.code =="0" && res.data.token!=""&&res.data.token!=null){
              LS.setItem("cempno",  store.state.cempno);
              store.state.storeAddress =    res.data.storeName
                store.state.storeNum  =  res.data.storeNo
              store.state.token =  res.data.token
              Router.push({name:'Message'}) 
            }else{
              this.errorTipsmask = true;
              this.errormasktipscontent="登录失败，请重试"
            }

            },function (res) {
        layer.closeAll('loading')

                      that.errorTipsmask = true;
                      that.errormasktipscontent="操作失败，请重试"
                                console.log("err")
                                console.log("error:"+res)
      })
                },
       getSign:function(){
         var that  = this
            this.loginstate = false;
            layer.load(2);

                // var url = store.state.runurl+"/watsons/rest/gateway/kms/onstore/admin/getSign"
                var url = store.state.runurl+"/onstore/admin/getSign"
                   this.$axios.post(url).then(res =>{
                    layer.closeAll('loading')
                    if(res.data.code =="0" && res.data.data.sign!=""&&res.data.data.sign!=null){
                       store.state.token =  res.data.data.sign
                       console.log("sign:"+res.data.data.sign)
                       this.getlogin(res.data.data.sign)

                     }else{
                      that.errorTipsmask = true;
                      that.errormasktipscontent="操作失败，请重试"
                      var re = res
                                console.log("err")
                                console.log("error:"+res)
                     }
                        //  that.loaddingstate = false
                  },function (res) {
        layer.closeAll('loading')
        // that.loaddingstate = false
        that.errorTipsmask = true;
        that.errormasktipscontent="操作失败，请重试"
                   console.log("err")
                   console.log("error:"+res)
      })
                }
   },
   
   mounted() {
      // var passr =""

      // runurl:"http://10.82.96.75:8080",
      //  uaturl:" http://10.82.96.75:8080",
      //  testurl:"http://10.82.25.197:8081",
      console.log('window.location.href',window.location.host)
                  if(store.state.env ==="1"){
                    // store.state.runurl = window.location.host
                    //  this.passr = encrypt("1234567890",t)
                    this.passr = store.state.uatpwd

                  }else{
                    store.state.runurl = store.state.testurl
                    
                     this.passr = store.state.testpwd
                  }
    store.state.phonetype = this.$route.query.settype
     if(this.teststate){
                       Router.push({name:'Message'}) 


     }else{
 this.getSign()
      //  this.getSign()
     }

 
   },
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loginbutton{
     text-align: center
  }
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
.errorcontent{
    color: #fff;
    
  }
/*弹框*/
.maskBoxblack{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    background-color: rgba(0, 0, 0, 0.63);
    /* z-index: 99999; */
    text-align: center;
}
.maskBox{
  margin: 17rem auto;
    display: inline-block;
    line-height: 0.6rem;
    vertical-align: middle;
    width: 80%;
    text-align: center;
}
</style>
