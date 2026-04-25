import hearbridgeRequest from "./hearbridge-request";
import type { SignCategoryItem } from "@/types/api";

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
};

export default SignCategoryAPI;
