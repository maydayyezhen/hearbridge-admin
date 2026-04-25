import hearbridgeRequest from "./hearbridge-request";
import type { SignResourceItem } from "@/types/api";

/** 手势资源接口基础路径。 */
const SIGN_RESOURCE_BASE_URL = "/sign/resources";

/** 手势资源查询参数。 */
export interface SignResourceQueryParams {
  /** 分类编码。 */
  categoryCode?: string;
}

/** 手势资源 API。 */
const SignResourceAPI = {
  /** 查询手势资源列表。 */
  list(params?: SignResourceQueryParams) {
    return hearbridgeRequest.get<any, SignResourceItem[]>(SIGN_RESOURCE_BASE_URL, {
      params,
    });
  },

  /** 根据资源编码查询资源详情。 */
  getByCode(code: string) {
    return hearbridgeRequest.get<any, SignResourceItem>(`${SIGN_RESOURCE_BASE_URL}/${code}`);
  },
};

export default SignResourceAPI;
