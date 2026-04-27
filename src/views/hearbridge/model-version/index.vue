<template>
  <div class="app-container">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div>
          <div class="text-base font-bold">模型版本管理</div>
          <div class="mt-1 text-sm text-gray-500">
            管理每次训练生成的模型版本，支持查看训练结果并发布当前可用模型。
          </div>
        </div>
      </template>

      <el-alert v-if="publishedVersion" type="success" show-icon :closable="false">
        <template #title>
          当前发布版本：{{ publishedVersion.versionName }}， 验证准确率：{{
            formatPercent(publishedVersion.finalValAccuracy)
          }}
        </template>
      </el-alert>

      <el-alert
        v-else
        type="warning"
        show-icon
        :closable="false"
        title="当前还没有发布模型版本。"
      />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="font-bold">模型版本列表</div>
          <el-button :loading="loading" @click="refreshAll">刷新</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="versionList" border>
        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column
          prop="versionName"
          label="版本名称"
          min-width="190"
          show-overflow-tooltip
        />

        <el-table-column prop="runName" label="训练运行" min-width="190" show-overflow-tooltip />

        <el-table-column prop="sampleCount" label="样本数" width="90" align="center" />

        <el-table-column prop="classCount" label="类别数" width="90" align="center" />

        <el-table-column label="验证准确率" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="success">
              {{ formatPercent(row.finalValAccuracy) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="训练耗时" width="110" align="center">
          <template #default="{ row }">
            {{ row.durationSec ? `${row.durationSec}s` : "-" }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="发布" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.published" type="success">当前</el-tag>
            <span v-else class="text-gray-400">否</span>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" min-width="170" />

        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)">详情</el-button>
            <el-button type="success" link :disabled="row.published" @click="handlePublish(row)">
              发布
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="模型版本详情" width="960px">
      <el-tabs v-if="currentVersion" v-model="detailActiveTab">
        <el-tab-pane label="基础信息" name="base">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="版本名称">
              {{ currentVersion.versionName }}
            </el-descriptions-item>

            <el-descriptions-item label="训练运行">
              {{ currentVersion.runName }}
            </el-descriptions-item>

            <el-descriptions-item label="样本 / 类别">
              {{ currentVersion.sampleCount }} 个样本，{{ currentVersion.classCount }} 个类别
            </el-descriptions-item>

            <el-descriptions-item label="训练 / 验证样本">
              {{ currentVersion.trainSampleCount }} / {{ currentVersion.valSampleCount }}
            </el-descriptions-item>

            <el-descriptions-item label="准确率">
              训练 {{ formatPercent(currentVersion.finalTrainAccuracy) }}，验证
              {{ formatPercent(currentVersion.finalValAccuracy) }}
            </el-descriptions-item>

            <el-descriptions-item label="损失">
              训练 {{ formatNumber(currentVersion.finalTrainLoss) }}，验证
              {{ formatNumber(currentVersion.finalValLoss) }}
            </el-descriptions-item>

            <el-descriptions-item label="模型文件">
              <el-link v-if="currentVersion.modelUrl" :href="currentVersion.modelUrl" target="_blank" type="primary">
                {{ currentVersion.modelUrl }}
              </el-link>
              <span v-else class="break-all text-gray-500">{{ currentVersion.modelPath || "-" }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="标签映射文件">
              <el-link
                v-if="currentVersion.labelMapUrl"
                :href="currentVersion.labelMapUrl"
                target="_blank"
                type="primary"
              >
                {{ currentVersion.labelMapUrl }}
              </el-link>
              <span v-else class="break-all text-gray-500">{{ currentVersion.labelMapPath || "-" }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="评估结果">
              <el-link
                v-if="currentVersion.evalResultUrl"
                :href="currentVersion.evalResultUrl"
                target="_blank"
                type="primary"
              >
                打开评估结果
              </el-link>
              <span v-else class="break-all text-gray-500">{{ currentVersion.evalResultPath || "-" }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="训练曲线" name="curve">
          <div v-if="currentVersion.trainingCurveUrl" class="space-y-3">
            <el-image
              :src="currentVersion.trainingCurveUrl"
              fit="contain"
              :preview-src-list="[currentVersion.trainingCurveUrl]"
              class="w-full rounded border bg-gray-50"
            />
            <div class="break-all text-xs text-gray-500">
              {{ currentVersion.trainingCurveUrl }}
            </div>
          </div>
          <div v-else class="rounded border border-dashed p-6 text-center text-gray-500">
            <div>暂无训练曲线图</div>
            <div class="mt-2 break-all text-xs">
              {{ currentVersion.trainingCurvePath || "未返回训练产物路径" }}
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="混淆矩阵" name="matrix">
          <div v-if="currentVersion.confusionMatrixUrl" class="space-y-3">
            <el-image
              :src="currentVersion.confusionMatrixUrl"
              fit="contain"
              :preview-src-list="[currentVersion.confusionMatrixUrl]"
              class="w-full rounded border bg-gray-50"
            />
            <div class="break-all text-xs text-gray-500">
              {{ currentVersion.confusionMatrixUrl }}
            </div>
          </div>
          <div v-else class="rounded border border-dashed p-6 text-center text-gray-500">
            <div>暂无混淆矩阵图</div>
            <div class="mt-2 break-all text-xs">
              {{ currentVersion.confusionMatrixPath || "未返回训练产物路径" }}
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="标签映射" name="labelMap">
          <el-table
            v-if="parseLabelMapEntries(currentVersion.labelMapJson).length > 0"
            :data="parseLabelMapEntries(currentVersion.labelMapJson)"
            border
            size="small"
          >
            <el-table-column prop="label" label="手势标签" min-width="180" show-overflow-tooltip />
            <el-table-column prop="index" label="类别编号" width="120" align="center" />
          </el-table>

          <pre v-else class="rounded bg-gray-50 p-4 text-sm whitespace-pre-wrap break-all">{{
            formatLabelMapJson(currentVersion.labelMapJson)
          }}</pre>
        </el-tab-pane>

        <el-tab-pane label="评估结果" name="evalResult">
          <div v-if="currentVersion.evalResultUrl" class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">评估结果文件预览</div>
              <el-link :href="currentVersion.evalResultUrl" target="_blank" type="primary">
                新窗口打开
              </el-link>
            </div>

            <iframe
              :src="currentVersion.evalResultUrl"
              class="h-[520px] w-full rounded border bg-white"
            />
          </div>

          <div v-else class="rounded border border-dashed p-6 text-center text-gray-500">
            <div>暂无评估结果文件</div>
            <div class="mt-2 break-all text-xs">
              {{ currentVersion.evalResultPath || "未返回训练产物路径" }}
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import ModelVersionAPI from "@/api/hearbridge/model-version";
import type {
  ModelVersionStatus,
  SignModelVersionItem,
} from "@/types/api/hearbridge/model-version";

/** 标签映射表格项。 */
interface LabelMapEntry {
  /** 手势标签。 */
  label: string;

  /** 类别编号。 */
  index: number | string;
}

/** 页面加载状态。 */
const loading = ref(false);

/** 详情弹窗是否显示。 */
const detailVisible = ref(false);

/** 详情弹窗当前标签页。 */
const detailActiveTab = ref("base");

/** 模型版本列表。 */
const versionList = ref<SignModelVersionItem[]>([]);

/** 当前发布版本。 */
const publishedVersion = ref<SignModelVersionItem | null>(null);

/** 当前查看详情的版本。 */
const currentVersion = ref<SignModelVersionItem | null>(null);

/** 加载模型版本列表。 */
async function loadVersionList(): Promise<void> {
  versionList.value = await ModelVersionAPI.list();
}

/** 加载当前发布版本。 */
async function loadPublishedVersion(): Promise<void> {
  try {
    publishedVersion.value = await ModelVersionAPI.getPublished();
  } catch (error) {
    console.error("加载当前发布模型版本失败：", error);
    publishedVersion.value = null;
  }
}

/** 刷新全部数据。 */
async function refreshAll(): Promise<void> {
  loading.value = true;

  try {
    await Promise.all([loadVersionList(), loadPublishedVersion()]);
  } finally {
    loading.value = false;
  }
}

/** 打开详情弹窗。 */
function openDetail(row: SignModelVersionItem): void {
  currentVersion.value = row;
  detailActiveTab.value = "base";
  detailVisible.value = true;
}

/** 发布模型版本。 */
async function handlePublish(row: SignModelVersionItem): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `确定发布模型版本「${row.versionName}」吗？发布后它会成为当前启用版本。`,
      "发布确认",
      {
        type: "warning",
        confirmButtonText: "发布",
        cancelButtonText: "取消",
      }
    );

    await ModelVersionAPI.publish(row.id);
    ElMessage.success("模型版本已发布");

    await refreshAll();
  } catch (error) {
    if (error !== "cancel") {
      console.error("发布模型版本失败：", error);
    }
  }
}

/** 格式化百分比。 */
function formatPercent(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(2)}%`;
}

/** 格式化数值。 */
function formatNumber(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return Number(value).toFixed(4);
}

/** 状态中文名称。 */
function statusLabel(status: ModelVersionStatus): string {
  const map: Record<ModelVersionStatus, string> = {
    TRAINED: "已训练",
    PUBLISHED: "已发布",
    DISABLED: "已停用",
  };

  return map[status] || status;
}

/** 状态标签类型。 */
function statusTagType(status: ModelVersionStatus): "success" | "warning" | "info" {
  const map: Record<ModelVersionStatus, "success" | "warning" | "info"> = {
    TRAINED: "warning",
    PUBLISHED: "success",
    DISABLED: "info",
  };

  return map[status] || "info";
}

/** 格式化标签映射 JSON。 */
function formatLabelMapJson(value?: string): string {
  if (!value) {
    return "{}";
  }

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

/**
 * 解析标签映射 JSON 为表格数据。
 *
 * @param value 标签映射 JSON 字符串
 * @returns 标签映射表格项
 */
function parseLabelMapEntries(value?: string): LabelMapEntry[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Record<string, number | string>;

    return Object.entries(parsed)
      .map(([label, index]) => ({ label, index }))
      .sort((a, b) => Number(a.index) - Number(b.index));
  } catch {
    return [];
  }
}

/** 组件挂载后加载数据。 */
onMounted(() => {
  refreshAll();
});
</script>
