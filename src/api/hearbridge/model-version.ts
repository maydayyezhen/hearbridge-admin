import hearbridgeRequest from "./hearbridge-request";
import type { SignModelVersionItem } from "@/types/api";

/** 模型版本接口基础路径。 */
const MODEL_VERSION_BASE_URL = "/sign/model-versions";

/** 模型版本 API。 */
const ModelVersionAPI = {
  /** 查询模型版本列表。 */
  list() {
    return hearbridgeRequest.get<any, SignModelVersionItem[]>(MODEL_VERSION_BASE_URL);
  },

  /** 查询当前发布版本。 */
  getPublished() {
    return hearbridgeRequest.get<any, SignModelVersionItem | null>(
      `${MODEL_VERSION_BASE_URL}/published`
    );
  },

  /** 发布指定模型版本。 */
  publish(id: number) {
    return hearbridgeRequest.put<any, SignModelVersionItem>(
      `${MODEL_VERSION_BASE_URL}/${id}/publish`
    );
  },
};

export default ModelVersionAPI;
