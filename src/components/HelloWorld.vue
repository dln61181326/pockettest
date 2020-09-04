<template>
  <div class="hello" @click="testRedScan()">
    <h1 id="log_msg">红点</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  // import   '../../static/toolsjs/Bridge'
export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  methods: {
    backPage(){//按钮的点击事件，实现关闭vue项目返回到原生页面中
      //安卓注册事件监听
 function connectWebViewJavascriptBridge(callback) {
   var that = this
  if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
  } else {
      document.addEventListener(
          'WebViewJavascriptBridgeReady'
          , function() {
              callback(WebViewJavascriptBridge)
              document.getElementById("log_msg").innerHTML = "已开启testRedScan";

var data='发送消息给java代码指定接收';
window.WebViewJavascriptBridge.callHandler(
    'redScanCodeCall'
    ,data
    , function(responseData) {
      bridgeLog('来自Java的回传数据： ' + responseData);
    }
);
          },
          false
      );
  }
}
//注册回调函数，第一次连接时调用 初始化函数
connectWebViewJavascriptBridge(function(bridge) {
   //初始化
  bridge.init(function(message, responseCallback) {
      //var data = {'Javascript Responds': 'Wee!'};
      responseCallback(data);
  });
  //Android调用js方法：functionInJs方法名称需要保持一致 ，并返回给Android通知
  bridge.registerHandler("redScanCodeCall", function(data, responseCallback) {
    responseCallback(data);
    alert(data)
  });
})
        },



     testRedScan() {
                  document.getElementById("log_msg").innerHTML = "已开启testRedScan";

var data='发送消息给java代码指定接收';
window.WebViewJavascriptBridge.callHandler(
    'redScanCodeCall'
    ,data
    , function(responseData) {
      bridgeLog('来自Java的回传数据： ' + responseData);
    }
);
       }
  },
  mounted() {
    this.backPage();
    
var tips = layer.tips('12002C05C3/421.0000'+"</br>"+"12002C05C3/421.0000", '#log_msg', {
  tips: [4, '#000'],time:5000
});

    // WebViewJavascriptBridge.callHandler('redScanCodeCall', alert("redScanCodeCall--ok"),function(data) {
    //               alert("redScanCodeCall"+data)          
    //         });              

    //         WebViewJavascriptBridge.callHandler('redScanCodeCall', alert("redScanCodeCall--ok"),function(data) {
    //               alert("redScanCodeCall"+data)          
    //         });            
            
    // window.addEventListener('WebViewJavascriptBridgeReady', console.log("scanok"), false);//false阻止默认事件
    // WebViewJavascriptBridge.callHandler('redScanCodeCall',{'name':'拍照'},function(data) {
    //               alert(data)          
    //         });   
    // window.addEventListener('WebViewJavascriptBridgeReady', console.log("ok"),false);//false阻止默认事件
    // this.testRedScan()
    // this.initscan()

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

#log_msg{
  width: 45%;
}
</style>
