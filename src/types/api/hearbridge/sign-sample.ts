/**
 * 手势样本质量状态。
 */
export type SignSampleQualityStatus = "UNKNOWN" | "GOOD" | "WARNING" | "BAD";

/**
 * 手势样本列表项。
 */
export interface SignSampleItem {
  /** 主键 ID。 */
  id: number;

  /** 样本唯一编码。 */
  sampleCode: string;

  /** 关联的手势资源编码。 */
  resourceCode: string;

  /** 训练标签。 */
  label: string;

  /** Python 服务中的 raw 样本文件路径。 */
  rawFilePath?: string;

  /** raw 样本文件在 MinIO 中的对象 Key。 */
  rawObjectKey?: string;

  /** 样本帧数。 */
  frameCount: number;

  /** 样本时长，单位毫秒。 */
  durationMs: number;

  /** 估算帧率。 */
  fps?: number;

  /** 检测到手部的帧比例。 */
  handPresentRatio?: number;

  /** 检测到人体姿态的帧比例。 */
  posePresentRatio?: number;

  /** Pose 是否已归一化。 */
  poseNormalized: boolean;

  /** 质量状态。 */
  qualityStatus: SignSampleQualityStatus;

  /** 质量说明。 */
  qualityMessage?: string;

  /** 是否删除。 */
  deleted: boolean;

  /** 创建时间。 */
  createdAt?: string;

  /** 更新时间。 */
  updatedAt?: string;
}

/**
 * 手势样本查询参数。
 */
export interface SignSampleQueryParams {
  /** 资源编码。 */
  resourceCode?: string;

  /** 质量状态。 */
  qualityStatus?: SignSampleQualityStatus;

  /** 是否删除。 */
  deleted?: boolean;

  /** 当前页码。 */
  page?: number;

  /** 每页数量。 */
  pageSize?: number;
}

/**
 * 手势样本分页结果。
 */
export interface SignSamplePageResult {
  /** 样本列表。 */
  items: SignSampleItem[];

  /** 总数量。 */
  total: number;

  /** 当前页码。 */
  page: number;

  /** 每页数量。 */
  pageSize: number;
}

/**
 * 手势样本统计结果。
 */
export interface SignSampleSummary {
  /** 样本总数。 */
  totalCount: number;

  /** 覆盖的资源数量。 */
  resourceCount: number;

  /** 高质量样本数量。 */
  goodCount: number;

  /** 警告样本数量。 */
  warningCount: number;

  /** 异常样本数量。 */
  badCount: number;

  /** 未知质量样本数量。 */
  unknownCount: number;
}

/**
 * 手势样本质量状态更新参数。
 */
export interface SignSampleQualityUpdateParams {
  /** 质量状态。 */
  qualityStatus: SignSampleQualityStatus;

  /** 质量说明。 */
  qualityMessage?: string;
}
