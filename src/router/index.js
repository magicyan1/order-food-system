// 也可以从其他文件导入
import * as VueRouter from "vue-router";
import Home from "../views/Home.vue";

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/goods",
    component: Home,
    children: [
      {
        path: "goods",
        component: () => import("../views/goods/goods.vue"),
      },
      {
        path: "order",
        component: () => import("../views/order/order.vue"),
      },
      {
        path: "ordermain",
        component: () => import("../views/order/ordermain.vue"),
      },
      {
        path: "queue",
        component: () => import("../views/queue/queue.vue"),
      },
      {
        path: "review",
        component: () => import("../views/review/review.vue"),
      },
      {
        path: "system",
        component: () => import("../views/system/system.vue"),
      },
      {
        path: "role",
        component: () => import("../views/system/role.vue"),
      },
      {
        path: "vip",
        component: () => import("../views/vip/vip.vue"),
      },
      {
        path: "addLevel",
        component: () => import("../views/vip/addLevel.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    component: () => import("../views/Error.vue"),
  },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
