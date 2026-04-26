import axios, { type AxiosResponse } from "axios";
import qs from "qs";
import router from "@/router";
import { clearAdminAuth, getAdminToken } from "@/utils/hearbridge-admin-auth";

/**
 * HearBridge 专用 HTTP 请求实例。
 *
 * 说明：
 * 当前 HearBridge 后端已有接口直接返回业务数据，
 * 并没有使用模板默认的 code / msg / data 响应壳，
 * 因此不复用 src/utils/request.ts。
 */
const hearbridgeRequest = axios.create({
  /** 使用 Vite 代理前缀。 */
  baseURL: import.meta.env.VITE_APP_BASE_API,

  /** 请求超时时间。 */
  timeout: 50000,

  /** 默认 JSON 请求头。 */
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },

  /** 数组参数序列化方式。 */
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

/**
 * 请求拦截器。
 *
 * 统一追加管理端 Authorization。
 */
hearbridgeRequest.interceptors.request.use(
  (config) => {
    const token = getAdminToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 响应拦截器。
 *
 * 当前后端直接返回数组或对象，所以成功时直接返回 response.data。
 * 401 时清理登录态并跳转登录页。
 */
hearbridgeRequest.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.msg ||
      error?.message ||
      "HearBridge 接口请求失败";

    if (status === 401) {
      clearAdminAuth();

      ElMessage.error(message || "登录已过期，请重新登录");

      if (router.currentRoute.value.path !== "/login") {
        router.push({
          path: "/login",
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        });
      }

      return Promise.reject(error);
    }

    ElMessage.error(message);
    return Promise.reject(error);
  }
);

export default hearbridgeRequest;
