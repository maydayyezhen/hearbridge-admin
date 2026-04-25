import axios, { type AxiosResponse } from "axios";
import qs from "qs";

/**
 * HearBridge 专用 HTTP 请求实例。
 *
 * 说明：
 * 当前 HearBridge 后端已有接口直接返回业务数据，
 * 并没有使用模板默认的 code / msg / data 响应壳，
 * 因此第一阶段不要复用 src/utils/request.ts。
 */
const hearbridgeRequest = axios.create({
  /**
   * 使用 Vite 代理前缀。
   */
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
 * 第一阶段暂时不处理后台管理员 token。
 * 后续接入正式 admin 登录时，再在这里统一追加 Authorization。
 */
hearbridgeRequest.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/**
 * 响应拦截器。
 *
 * 当前后端直接返回数组或对象，所以这里直接返回 response.data。
 */
hearbridgeRequest.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.msg ||
      error?.message ||
      "HearBridge 接口请求失败";

    ElMessage.error(message);
    return Promise.reject(error);
  }
);

export default hearbridgeRequest;
