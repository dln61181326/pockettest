import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    storeNum: "",
    storeAddress: "",
    isback: true,
    canprintType: false,
    token: "",
    returnParam: "",
    orderItem: [],
    cempno: "",
    totalCount: "",
    channelCode: "",
    deliveryGoodsCode: "",
    detailorderFrom: "",
    beforeOrderNum: "",
    beforePickOrderNum: "",
    beforeReturnOrderNum: "",
    userchannel: "",
    inde: "",
    sort: "",
    channelArr: "",
    orderAmt: "",
    orderlist: {},
    returnreason: "",
    phonetype: "",
    expresskeyArr: [],
    expressreasonArr: [],
    cancelreasonArr: [],
    cancelkeyArr: [],
    returnreasonArr: [],
    returnkeyArr: [],
    changnnellistCN: "",
    // url
    env: "0", //1是正式场 0是测试场
    runurl: "http://10.82.96.75:8080",
    uaturl: " http://10.82.96.75:8080",
    testurl: "http://10.82.25.197:8081",
    p360url: "http://10.82.96.75:8080/watsons/rest/gateway/kms/onstore/admin",
    ul: "http://10.82.26.249:8888/onstore/admin/",
    testpwd: "1234567890",
    uatpwd: "epUser123@abc#",
    pickingstate: true,
    // 多单拣货
    MultipleOrderList: [],
    MultipleItemList:[],
    sumItemList: [],
    pickitemlist:[],
    allItemList:[],
    goodsstate:[],
    ConfirmMultipleOrderList:[],

  },

  mutations: {
    setErrorTipsTitle(state, title) {

      state.errortipstitle = title;
    },
    setModelindex(state, index) {

      state.modelindex = index;
    },
    setsuppliername(supplier) {
      state.suppliername = supplier
    },

    setJumpPath(path) {
      state.jumpPath = path
    },
    setIndex(dataIndex) {
      state.selectIndex = dataIndex
    },

    setDataList: function (datalist) {
      console.log("setDataList=============" + datalist)
      state.datalist = datalist
    }
  },

})





export default store
