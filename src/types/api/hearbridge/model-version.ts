/**
 * 模型版本状态。
 */
export type ModelVersionStatus = "TRAINED" | "PUBLISHED" | "DISABLED";

/**
 * 模型版本列表项。
 */
export interface SignModelVersionItem {
  /** 主键 ID。 */
  id: number;

  /** 模型版本名称。 */
  versionName: string;

  /** Python 训练运行名称。 */
  runName: string;

  /** 模型文件路径。 */
  modelPath: string;

  /** 标签映射文件路径。 */
  labelMapPath: string;

  /** 训练曲线图路径。 */
  trainingCurvePath?: string;

  /** 混淆矩阵图路径。 */
  confusionMatrixPath?: string;

  /** 评估结果文本路径。 */
  evalResultPath?: string;

  /** 样本总数。 */
  sampleCount: number;

  /** 训练集样本数。 */
  trainSampleCount: number;

  /** 验证集样本数。 */
  valSampleCount: number;

  /** 类别数量。 */
  classCount: number;

  /** 输入形状。 */
  inputShape?: string;

  /** 最终训练准确率。 */
  finalTrainAccuracy?: number;

  /** 最终验证准确率。 */
  finalValAccuracy?: number;

  /** 最终训练损失。 */
  finalTrainLoss?: number;

  /** 最终验证损失。 */
  finalValLoss?: number;

  /** 训练耗时，单位秒。 */
  durationSec?: number;

  /** 标签映射 JSON。 */
  labelMapJson?: string;

  /** 状态。 */
  status: ModelVersionStatus;

  /** 是否当前发布版本。 */
  published: boolean;

  /** 创建时间。 */
  createdAt?: string;

  /** 更新时间。 */
  updatedAt?: string;
}
