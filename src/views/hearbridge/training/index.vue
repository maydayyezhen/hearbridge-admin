<template>
  <div class="app-container">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-base font-bold">训练管理</div>
            <div class="mt-1 text-sm text-gray-500">
              基于已转换的 feature 数据集执行模型训练，生成模型文件、标签映射、训练曲线和混淆矩阵。
            </div>
          </div>

          <el-button type="primary" :loading="trainingLoading" @click="handleTrainModel">
            开始训练
          </el-button>
        </div>
      </template>

      <el-alert
        type="warning"
        show-icon
        :closable="false"
        title="训练前请先在样本管理页面完成“同步样本”和“转换特征数据”。"
      />
    </el-card>

    <el-card v-if="trainResult" shadow="never">
      <template #header>
        <div class="font-bold">最近一次训练结果</div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="训练名称">
          {{ trainResult.runName }}
        </el-descriptions-item>

        <el-descriptions-item label="训练耗时">
          {{ trainResult.durationSec }} 秒
        </el-descriptions-item>

        <el-descriptions-item label="样本总数">
          {{ trainResult.sampleCount }}
        </el-descriptions-item>

        <el-descriptions-item label="类别数量">
          {{ trainResult.classCount }}
        </el-descriptions-item>

        <el-descriptions-item label="训练集 / 验证集">
          {{ trainResult.trainSampleCount }} / {{ trainResult.valSampleCount }}
        </el-descriptions-item>

        <el-descriptions-item label="输入形状">
          {{ formatInputShape(trainResult.inputShape) }}
        </el-descriptions-item>

        <el-descriptions-item label="训练轮数">
          {{ trainResult.epochsRan }}
        </el-descriptions-item>

        <el-descriptions-item label="验证准确率">
          <el-tag type="success">
            {{ formatPercent(trainResult.finalValAccuracy) }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="训练准确率">
          {{ formatPercent(trainResult.finalTrainAccuracy) }}
        </el-descriptions-item>

        <el-descriptions-item label="验证损失">
          {{ formatNumber(trainResult.finalValLoss) }}
        </el-descriptions-item>

        <el-descriptions-item label="模型文件" :span="2">
          <span class="break-all">{{ trainResult.modelPath }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="标签映射" :span="2">
          <span class="break-all">{{ trainResult.labelMapPath }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="训练曲线" :span="2">
          <span class="break-all">{{ trainResult.trainingCurvePath }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="混淆矩阵" :span="2">
          <span class="break-all">{{ trainResult.confusionMatrixPath }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="模型版本 ID">
          {{ trainResult.versionId || "-" }}
        </el-descriptions-item>

        <el-descriptions-item label="版本状态">
          <el-tag>
            {{ trainResult.versionStatus || "-" }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="mt-4">
        <div class="mb-2 font-bold">标签映射</div>
        <el-table :data="labelMapRows" border>
          <el-table-column prop="label" label="标签" />
          <el-table-column prop="id" label="类别 ID" width="120" align="center" />
        </el-table>
      </div>
    </el-card>

    <el-empty v-else description="暂未执行训练" />
  </div>
</template>

<script setup lang="ts">
import SignSampleAPI from "@/api/hearbridge/sign-sample";
import type { ModelTrainResult } from "@/types/api/hearbridge/sign-sample";

/** 训练加载状态。 */
const trainingLoading = ref(false);

/** 最近一次训练结果。 */
const trainResult = ref<ModelTrainResult | null>(null);

/** 标签映射表格数据。 */
const labelMapRows = computed(() => {
  if (!trainResult.value?.labelMap) {
    return [];
  }

  return Object.entries(trainResult.value.labelMap).map(([label, id]) => ({
    label,
    id,
  }));
});

/** 执行模型训练。 */
async function handleTrainModel(): Promise<void> {
  try {
    await ElMessageBox.confirm(
      "确定开始训练模型吗？训练过程可能需要一段时间，请确认 feature 数据已经生成。",
      "训练确认",
      {
        type: "warning",
        confirmButtonText: "开始训练",
        cancelButtonText: "取消",
      }
    );

    trainingLoading.value = true;

    const result = await SignSampleAPI.trainModel();
    trainResult.value = result;

    ElMessage.success(
      `训练完成：样本 ${result.sampleCount} 条，类别 ${result.classCount} 个，验证准确率 ${formatPercent(result.finalValAccuracy)}`
    );
  } catch (error) {
    if (error !== "cancel") {
      console.error("模型训练失败：", error);
    }
  } finally {
    trainingLoading.value = false;
  }
}

/** 格式化百分比。 */
function formatPercent(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(2)}%`;
}

/** 格式化数字。 */
function formatNumber(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return Number(value).toFixed(4);
}

/** 格式化输入形状。 */
function formatInputShape(inputShape?: number[]): string {
  if (!inputShape || inputShape.length === 0) {
    return "-";
  }

  return inputShape.join(" × ");
}
</script>
