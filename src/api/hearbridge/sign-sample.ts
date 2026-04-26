import hearbridgeRequest from "./hearbridge-request";
import type {
  SignSamplePageResult,
  SignSampleQualityUpdateParams,
  SignSampleQueryParams,
  SignSampleSummary,
  SignSampleItem,
} from "@/types/api";

/** 手势样本接口基础路径。 */
const SIGN_SAMPLE_BASE_URL = "/sign/samples";

/** 手势样本 API。 */
const SignSampleAPI = {
  /** 分页查询手势样本列表。 */
  list(params?: SignSampleQueryParams) {
    return hearbridgeRequest.get<any, SignSamplePageResult>(SIGN_SAMPLE_BASE_URL, {
      params,
    });
  },

  /** 查询手势样本统计信息。 */
  summary() {
    return hearbridgeRequest.get<any, SignSampleSummary>(`${SIGN_SAMPLE_BASE_URL}/summary`);
  },

  /** 更新样本质量状态。 */
  updateQuality(id: number, data: SignSampleQualityUpdateParams) {
    return hearbridgeRequest.put<any, SignSampleItem>(
      `${SIGN_SAMPLE_BASE_URL}/${id}/quality`,
      data
    );
  },

  /** 软删除样本。 */
  delete(id: number) {
    return hearbridgeRequest.delete<any, void>(`${SIGN_SAMPLE_BASE_URL}/${id}`);
  },
};

export default SignSampleAPI;
