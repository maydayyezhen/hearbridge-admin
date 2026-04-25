import hearbridgeRequest from "./hearbridge-request";
import type { SignCategoryItem, SignCategorySaveParams } from "@/types/api";

/** 手势分类接口基础路径。 */
const SIGN_CATEGORY_BASE_URL = "/sign/categories";

/** 手势分类 API。 */
const SignCategoryAPI = {
  /** 查询全部手势分类。 */
  list() {
    return hearbridgeRequest.get<any, SignCategoryItem[]>(SIGN_CATEGORY_BASE_URL);
  },

  /** 根据分类编码查询分类详情。 */
  getByCode(code: string) {
    return hearbridgeRequest.get<any, SignCategoryItem>(`${SIGN_CATEGORY_BASE_URL}/${code}`);
  },

  /** 新增手势分类。 */
  create(data: SignCategorySaveParams) {
    return hearbridgeRequest.post<any, SignCategoryItem>(SIGN_CATEGORY_BASE_URL, data);
  },

  /** 更新手势分类。 */
  update(id: number, data: SignCategorySaveParams) {
    return hearbridgeRequest.put<any, SignCategoryItem>(`${SIGN_CATEGORY_BASE_URL}/${id}`, data);
  },

  /** 删除手势分类。 */
  delete(id: number) {
    return hearbridgeRequest.delete<any, void>(`${SIGN_CATEGORY_BASE_URL}/${id}`);
  },
};

export default SignCategoryAPI;
