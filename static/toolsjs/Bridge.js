let isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
let isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

//这是必须要写的，用来创建一些设置
function setupWebViewJavascriptBridge(callback) {
    //Android使用
    if (isAndroid) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function () {
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
        console.log('tag', '安卓')
        window.sessionStorage.phoneType = 'android'
    }

    //iOS使用
    if (isiOS) {
        if (window.WebViewJavascriptBridge) {

            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {

            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe)
        }, 0);
        console.log('tag', 'ios');
        window.sessionStorage.phoneType = 'ios'
        
    }
}
//注册回调函数，第一次连接时调用 初始化函数(android需要初始化,ios不用)
setupWebViewJavascriptBridge(function (bridge) {
    if (isAndroid) {
        //初始化
        bridge.init(function (message, responseCallback) {
            var data = {
                'Javascript Responds': 'Wee!'
            };
            responseCallback(data);
        })
    }
})




export default {
 
    
    callHandler(name, data, callback) {
        let result = ""
        if(  window.sessionStorage.phoneType === 'ios'){
            result = window.webkit.messageHandlers[name].postMessage(data);
        }else{
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler(name, data, callback)
            })
        }
        
    },
    // APP调js方法 （参数分别为:js提供的方法名  回调）
    registerHandler(name, callback) {
        if(window.sessionStorage.phoneType === 'ios'){
            window[name] = res => {
                let data = '';
                if(res){
                    data = JSON.parse(JSON.stringify(res)) 
                }
                callback && callback(data)
            }
        }
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(name, function (data, responseCallback) {
                callback(data, responseCallback)
            })
        })
    }
}