import hearbridgeRequest from "./hearbridge-request";
import type { HearBridgePageResult, SignResourceItem, SignResourceSaveParams } from "@/types/api";

/** 手势资源接口基础路径。 */
const SIGN_RESOURCE_BASE_URL = "/sign/resources";

/** 手势资源查询参数。 */
export interface SignResourceQueryParams {
  /** 分类编码。 */
  categoryCode?: string;
}

/** 手势资源分页查询参数。 */
export interface SignResourcePageParams extends SignResourceQueryParams {
  /** 当前页码，从 1 开始。 */
  pageNo: number;
  /** 每页数量。 */
  pageSize: number;
}

/** 手势资源 API。 */
const SignResourceAPI = {
  /** 查询手势资源列表。 */
  list(params?: SignResourceQueryParams) {
    return hearbridgeRequest.get<any, SignResourceItem[]>(SIGN_RESOURCE_BASE_URL, {
      params,
    });
  },

  /** 分页查询手势资源列表。 */
  page(params: SignResourcePageParams) {
    return hearbridgeRequest.get<any, HearBridgePageResult<SignResourceItem>>(
      `${SIGN_RESOURCE_BASE_URL}/page`,
      { params }
    );
  },

  /** 根据资源编码查询资源详情。 */
  getByCode(code: string) {
    return hearbridgeRequest.get<any, SignResourceItem>(`${SIGN_RESOURCE_BASE_URL}/${code}`);
  },

  /** 新增手势资源。 */
  create(data: SignResourceSaveParams) {
    return hearbridgeRequest.post<any, SignResourceItem>(SIGN_RESOURCE_BASE_URL, data);
  },

  /** 更新手势资源。 */
  update(id: number, data: SignResourceSaveParams) {
    return hearbridgeRequest.put<any, SignResourceItem>(`${SIGN_RESOURCE_BASE_URL}/${id}`, data);
  },

  /** 删除手势资源。 */
  delete(id: number) {
    return hearbridgeRequest.delete<any, void>(`${SIGN_RESOURCE_BASE_URL}/${id}`);
  },
};

export default SignResourceAPI;
