import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/Index"
    },
    {
      path: "/TestPage",
      name: "TestPage",
      // component: TestPage,
      component: () => import("../Views/TestPage")
    },

    {
      path: "/Index",
      name: "Index",
      // component: Index,
      component: () => import("../components/Index")
    },

    {
      path: "/CustomerReturnGoodsDetail",
      name: "CustomerReturnGoodsDetail",
      // component: CustomerReturnGoodsDetail
      component: () => import("../components/CustomerReturnGoodsDetail")
    },
    {
      path: "/PickGoods",
      name: "PickGoods",
      // component: PickGoods
      component: () => import("../components/PickGoods")
    },

    {
      path: "/PickOrderList",
      name: "PickOrderList",
      // component: PickOrderList
      component: () => import("../components/PickOrderList")
    },
    {
      path: "/ReturnGoodsList",
      name: "ReturnGoodsList",
      component: () => import("../components/ReturnGoodsList")
    },
    {
      path: "/Message",
      name: "Message",
      component: () => import("../components/Message")
    },
    // ================猫超退货==========================
    {
      path: "/CustomerReturnGoodsDetailForTmall",
      name: "CustomerReturnGoodsDetailForTmall",
      component: () => import("../components/ReturnGoods/CustomerReturnGoodsDetailForTmall")
    },
    {
      path: "/ReturnGoodsListForTmall",
      name: "ReturnGoodsListForTmall",
      component: () => import("../components/ReturnGoods/ReturnGoodsListForTmall")
    },
    // ===============批量拣货==================
    {
      path: "/ConfirmOrderList",
      name: "ConfirmOrderList",
      component: () => import("../components/pickingGoods/ConfirmOrderList")
    },
    {
      path: "/OrderList",
      name: "OrderList",
      component: () => import("../components/OrderList")
    },
    {
      path: "/MultipleChoiceArrPickingGoodsDetails",
      name: "Details",
      component: () =>
        import(
          "../components/pickingGoods/MultipleChoiceArrPickingGoodsDetails"
        )
    },

    {
      path: "/MultipleChoiceArrPickingGoodsList",
      name: "MultipleChoiceArrPickingGoodsList",
      component: () =>
        import("../components/pickingGoods/MultipleChoiceArrPickingGoodsList"),
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/MultipleOrderList",
      name: "MultipleOrderList",
      component: () => import("../components/pickingGoods/MultipleOrderList")
    },

    // ===============已拣货==================
    {
      path: "/Details",
      name: "Details",
      component: () => import("../components/Details")
    },
    {
      path: "/AlreadyPickOrderList",
      name: "AlreadyPickOrderList",
      component: () =>
        import("../components/AlreadyPickOrder/AlreadyPickOrderList")
    },

    {
      path: "/AlreadyPickOrderDetails",
      name: "AlreadyPickOrderDetails",
      component: () =>
        import("../components/AlreadyPickOrder/AlreadyPickOrderDetails")
    }
  ]
});
