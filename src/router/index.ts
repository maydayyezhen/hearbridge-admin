import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import { getAdminToken } from "@/utils/hearbridge-admin-auth";
import { usePermissionStore } from "@/store/modules/permission";

/**
 * 后台基础布局组件。
 */
export const Layout = () => import("@/layouts/index.vue");
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/hearbridge/categories",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", icon: "user", hidden: true },
      },
      {
        path: "my-notice",
        name: "MyNotice",
        component: () => import("@/views/profile/notice/index.vue"),
        meta: { title: "我的通知", icon: "user", hidden: true },
      },
      {
        path: "/detail/:id(\\d+)",
        name: "DemoDetail",
        component: () => import("@/views/demo/detail.vue"),
        meta: { title: "详情页缓存", icon: "user", hidden: true, keepAlive: true },
      },
    ],
  },

  {
    path: "/hearbridge",
    name: "HearBridge",
    component: Layout,
    redirect: "/hearbridge/categories",
    meta: {
      title: "听桥管理",
      icon: "menu",
    },
    children: [
      {
        path: "categories",
        name: "HearBridgeSignCategory",
        component: () => import("@/views/hearbridge/category/index.vue"),
        meta: {
          title: "手势分类管理",
          icon: "dict",
          keepAlive: true,
        },
      },
      {
        path: "resources",
        name: "HearBridgeSignResource",
        component: () => import("@/views/hearbridge/resource/index.vue"),
        meta: {
          title: "手势资源管理",
          icon: "document",
          keepAlive: true,
        },
      },
      {
        path: "samples",
        name: "HearBridgeSignSample",
        component: () => import("@/views/hearbridge/sample/index.vue"),
        meta: {
          title: "样本管理",
          icon: "document",
          keepAlive: true,
        },
      },
      {
        path: "training",
        name: "HearBridgeTraining",
        component: () => import("@/views/hearbridge/training/index.vue"),
        meta: {
          title: "训练管理",
          icon: "monitor",
          keepAlive: true,
        },
      },
      {
        path: "model-versions",
        name: "HearBridgeModelVersion",
        component: () => import("@/views/hearbridge/model-version/index.vue"),
        meta: {
          title: "模型版本管理",
          icon: "monitor",
          keepAlive: true,
        },
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/** 免登录路由白名单。 */
const whiteList = ["/login"];

/**
 * 管理端路由守卫。
 *
 * 无 token 时跳转登录页。
 */
router.beforeEach((to) => {
  const token = getAdminToken();
  const permissionStore = usePermissionStore();

  // 当前管理端第一版不接模板动态菜单接口，直接用静态路由生成侧边栏菜单。
  if (!permissionStore.isRouteGenerated) {
    permissionStore.useConstantRoutesForDev();
  }

  if (token) {
    if (to.path === "/login") {
      return "/hearbridge/categories";
    }

    return true;
  }

  if (whiteList.includes(to.path)) {
    return true;
  }

  return {
    path: "/login",
    query: {
      redirect: to.fullPath,
    },
  };
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
