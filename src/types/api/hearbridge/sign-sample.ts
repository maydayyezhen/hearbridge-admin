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

/**
 * 手势样本同步结果。
 */
export interface SignSampleSyncResult {
  /** Python 扫描到的样本数量。 */
  scannedCount: number;

  /** 新增数量。 */
  insertedCount: number;

  /** 更新数量。 */
  updatedCount: number;

  /** 跳过数量。 */
  skippedCount: number;

  /** 异常样本数量。 */
  badCount: number;
}

/**
 * raw → feature 转换结果。
 */
export interface FeatureConvertResult {
  /** raw dataset 根目录。 */
  rawRoot: string;

  /** feature 输出根目录。 */
  featureRoot: string;

  /** 扫描样本数量。 */
  scannedCount: number;

  /** 成功转换数量。 */
  convertedCount: number;

  /** 跳过数量。 */
  skippedCount: number;

  /** 失败数量。 */
  failedCount: number;

  /** 失败项。 */
  failedItems?: Array<Record<string, unknown>>;

  /** 结果说明。 */
  message?: string;
}

/**
 * 模型训练结果。
 */
export interface ModelTrainResult {
  /** 训练运行名称。 */
  runName: string;

  /** 训练数据目录。 */
  dataRoot: string;

  /** 训练产物目录。 */
  artifactDir: string;

  /** 模型文件路径。 */
  modelPath: string;

  /** 标签映射文件路径。 */
  labelMapPath: string;

  /** 训练曲线图路径。 */
  trainingCurvePath: string;

  /** 混淆矩阵图路径。 */
  confusionMatrixPath: string;

  /** 评估结果文本路径。 */
  evalResultPath: string;

  /** 样本总数。 */
  sampleCount: number;

  /** 训练集样本数。 */
  trainSampleCount: number;

  /** 验证集样本数。 */
  valSampleCount: number;

  /** 类别数量。 */
  classCount: number;

  /** 输入形状。 */
  inputShape: number[];

  /** 实际训练轮数。 */
  epochsRan: number;

  /** 最终训练准确率。 */
  finalTrainAccuracy: number;

  /** 最终验证准确率。 */
  finalValAccuracy: number;

  /** 最终训练损失。 */
  finalTrainLoss: number;

  /** 最终验证损失。 */
  finalValLoss: number;

  /** 训练耗时，单位秒。 */
  durationSec: number;

  /** 标签映射。 */
  labelMap: Record<string, number>;

  /** 结果说明。 */
  message?: string;

  /** 后端登记后的模型版本 ID。 */
  versionId?: number;

  /** 后端登记后的模型版本名称。 */
  versionName?: string;

  /** 后端登记后的模型版本状态。 */
  versionStatus?: string;

  /** 是否当前发布版本。 */
  published?: boolean;
}
