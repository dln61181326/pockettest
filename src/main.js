// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import store from './vuex/store'
import axios from 'axios'
import layer from "layui-layer";
import layerM from 'vue2-layer-mobile'

import Bridge from '../static/toolsjs/Bridge.js'
Vue.prototype.$bridge = Bridge
Vue.prototype.$layerM = layer
Vue.prototype.$axios = axios
Vue.prototype.HOST = '/apis'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  $,
  store,
  components: { App },
  template: '<App/>'
})
