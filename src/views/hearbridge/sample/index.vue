<template>
  <div class="app-container">
    <el-row :gutter="16" class="mb-4">
      <el-col :span="4">
        <el-card shadow="never">
          <div class="text-sm text-gray-500">总样本数</div>
          <div class="mt-2 text-2xl font-bold">{{ summary.totalCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="4">
        <el-card shadow="never">
          <div class="text-sm text-gray-500">覆盖动作数</div>
          <div class="mt-2 text-2xl font-bold">{{ summary.resourceCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="4">
        <el-card shadow="never">
          <div class="text-sm text-gray-500">高质量样本</div>
          <div class="mt-2 text-2xl font-bold text-green-600">{{ summary.goodCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="4">
        <el-card shadow="never">
          <div class="text-sm text-gray-500">警告样本</div>
          <div class="mt-2 text-2xl font-bold text-orange-500">{{ summary.warningCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="4">
        <el-card shadow="never">
          <div class="text-sm text-gray-500">异常样本</div>
          <div class="mt-2 text-2xl font-bold text-red-600">{{ summary.badCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="4">
        <el-card shadow="never">
          <div class="text-sm text-gray-500">未知样本</div>
          <div class="mt-2 text-2xl font-bold text-gray-500">{{ summary.unknownCount }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="mb-4">
      <template #header>
        <div>
          <div class="text-base font-bold">样本管理</div>
          <div class="mt-1 text-sm text-gray-500">
            第一版管理 raw dataset 样本元数据，支持筛选、质量标记和软删除。
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryForm">
        <el-form-item label="资源">
          <el-select
            v-model="queryForm.resourceCode"
            clearable
            filterable
            placeholder="请选择资源"
            :loading="resourceLoading"
            class="w-60"
          >
            <el-option
              v-for="item in resourceOptions"
              :key="item.code"
              :label="`${item.nameZh}（${item.code}）`"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="质量状态">
          <el-select
            v-model="queryForm.qualityStatus"
            clearable
            placeholder="请选择质量状态"
            class="w-40"
          >
            <el-option label="未知" value="UNKNOWN" />
            <el-option label="良好" value="GOOD" />
            <el-option label="警告" value="WARNING" />
            <el-option label="异常" value="BAD" />
          </el-select>
        </el-form-item>

        <el-form-item label="删除状态">
          <el-select v-model="queryForm.deleted" placeholder="请选择删除状态" class="w-36">
            <el-option label="未删除" value="false" />
            <el-option label="已删除" value="true" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSearch">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button :loading="loading" @click="refreshAll">刷新统计</el-button>
          <el-button type="success" :loading="syncLoading" @click="handleSyncSamples">
            同步样本
          </el-button>
          <el-button type="warning" :loading="convertLoading" @click="handleConvertFeatures">
            转换特征数据
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="sampleList" border>
        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column prop="sampleCode" label="样本编码" min-width="220" show-overflow-tooltip />

        <el-table-column prop="resourceCode" label="资源编码" min-width="130" />

        <el-table-column prop="label" label="标签" min-width="100" />

        <el-table-column prop="frameCount" label="帧数" width="90" align="center" />

        <el-table-column label="时长" width="100" align="center">
          <template #default="{ row }">{{ formatDuration(row.durationMs) }}</template>
        </el-table-column>

        <el-table-column label="FPS" width="90" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.fps) }}
          </template>
        </el-table-column>

        <el-table-column label="手部比例" width="110" align="center">
          <template #default="{ row }">
            {{ formatRatio(row.handPresentRatio) }}
          </template>
        </el-table-column>

        <el-table-column label="姿态比例" width="110" align="center">
          <template #default="{ row }">
            {{ formatRatio(row.posePresentRatio) }}
          </template>
        </el-table-column>

        <el-table-column label="Pose 归一化" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.poseNormalized ? 'success' : 'info'">
              {{ row.poseNormalized ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="质量状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="qualityTagType(row.qualityStatus)">
              {{ qualityLabel(row.qualityStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="qualityMessage"
          label="质量说明"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column
          prop="rawFilePath"
          label="Raw 文件路径"
          min-width="260"
          show-overflow-tooltip
        />

        <el-table-column prop="createdAt" label="创建时间" min-width="180" />

        <el-table-column label="操作" width="190" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openQualityDialog(row)">标记质量</el-button>
            <el-button type="danger" link :disabled="row.deleted" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="queryForm.page"
          v-model:page-size="queryForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadSampleList"
          @current-change="loadSampleList"
        />
      </div>
    </el-card>

    <el-dialog v-model="qualityDialogVisible" title="标记样本质量" width="520px">
      <el-form :model="qualityForm" label-width="100px">
        <el-form-item label="样本编码">
          <el-input :model-value="currentSample?.sampleCode" disabled />
        </el-form-item>

        <el-form-item label="质量状态">
          <el-select v-model="qualityForm.qualityStatus" class="w-full">
            <el-option label="未知" value="UNKNOWN" />
            <el-option label="良好" value="GOOD" />
            <el-option label="警告" value="WARNING" />
            <el-option label="异常" value="BAD" />
          </el-select>
        </el-form-item>

        <el-form-item label="质量说明">
          <el-input
            v-model="qualityForm.qualityMessage"
            type="textarea"
            :rows="4"
            placeholder="请输入质量说明，例如：手部关键点缺失过多"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="qualityDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="qualitySubmitLoading" @click="handleUpdateQuality">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import SignResourceAPI from "@/api/hearbridge/sign-resource";
import SignSampleAPI from "@/api/hearbridge/sign-sample";
import type { SignResourceItem } from "@/types/api/hearbridge/sign-resource";
import type {
  SignSampleItem,
  SignSampleQualityStatus,
  SignSampleSummary,
} from "@/types/api/hearbridge/sign-sample";

/** 页面加载状态。 */
const loading = ref(false);

/** 资源选项加载状态。 */
const resourceLoading = ref(false);

/** 质量标记提交状态。 */
const qualitySubmitLoading = ref(false);

/** 样本同步状态。 */
const syncLoading = ref(false);

/** 特征转换状态。 */
const convertLoading = ref(false);

/** 质量标记弹窗是否显示。 */
const qualityDialogVisible = ref(false);

/** 当前操作的样本。 */
const currentSample = ref<SignSampleItem | null>(null);

/** 资源选项。 */
const resourceOptions = ref<SignResourceItem[]>([]);

/** 样本列表。 */
const sampleList = ref<SignSampleItem[]>([]);

/** 总数量。 */
const total = ref(0);

/** 查询表单。 */
const queryForm = reactive({
  /** 资源编码。 */
  resourceCode: "",

  /** 质量状态。 */
  qualityStatus: "" as "" | SignSampleQualityStatus,

  /** 删除状态。 */
  deleted: "false",

  /** 当前页码。 */
  page: 1,

  /** 每页数量。 */
  pageSize: 20,
});

/** 样本统计。 */
const summary = reactive<SignSampleSummary>({
  totalCount: 0,
  resourceCount: 0,
  goodCount: 0,
  warningCount: 0,
  badCount: 0,
  unknownCount: 0,
});

/** 质量标记表单。 */
const qualityForm = reactive({
  /** 质量状态。 */
  qualityStatus: "BAD" as SignSampleQualityStatus,

  /** 质量说明。 */
  qualityMessage: "",
});

/** 加载资源选项。 */
async function loadResourceOptions(): Promise<void> {
  resourceLoading.value = true;

  try {
    resourceOptions.value = await SignResourceAPI.list();
  } catch (error) {
    console.error("加载资源选项失败：", error);
  } finally {
    resourceLoading.value = false;
  }
}

/** 从 Python 服务同步 raw 样本。 */
async function handleSyncSamples(): Promise<void> {
  try {
    await ElMessageBox.confirm(
      "确定从 Python 服务同步 raw dataset 样本吗？同步后会刷新样本列表和统计数据。",
      "同步确认",
      {
        type: "info",
        confirmButtonText: "同步",
        cancelButtonText: "取消",
      }
    );

    syncLoading.value = true;

    const result = await SignSampleAPI.sync();

    ElMessage.success(
      `同步完成：扫描 ${result.scannedCount} 条，新增 ${result.insertedCount} 条，更新 ${result.updatedCount} 条，跳过 ${result.skippedCount} 条，异常 ${result.badCount} 条`
    );

    await refreshAll();
  } catch (error) {
    if (error !== "cancel") {
      console.error("同步样本失败：", error);
    }
  } finally {
    syncLoading.value = false;
  }
}

/** 执行 raw → feature 转换。 */
async function handleConvertFeatures(): Promise<void> {
  try {
    await ElMessageBox.confirm(
      "确定将 raw dataset 转换为模型训练用的 feature 数据吗？转换后会生成 data_processed_arm_pose_10fps 目录下的训练样本。",
      "转换确认",
      {
        type: "warning",
        confirmButtonText: "开始转换",
        cancelButtonText: "取消",
      }
    );

    convertLoading.value = true;

    const result = await SignSampleAPI.convertFeatures();

    if (result.failedCount > 0 || result.skippedCount > 0) {
      ElMessage.warning(
        `转换完成，但存在异常：扫描 ${result.scannedCount} 条，成功 ${result.convertedCount} 条，跳过 ${result.skippedCount} 条，失败 ${result.failedCount} 条`
      );
    } else {
      ElMessage.success(
        `转换完成：扫描 ${result.scannedCount} 条，成功转换 ${result.convertedCount} 条`
      );
    }

    console.log("raw → feature 转换结果：", result);
  } catch (error) {
    if (error !== "cancel") {
      console.error("转换特征数据失败：", error);
    }
  } finally {
    convertLoading.value = false;
  }
}

/** 加载样本统计信息。 */
async function loadSummary(): Promise<void> {
  try {
    const result = await SignSampleAPI.summary();

    summary.totalCount = result.totalCount;
    summary.resourceCount = result.resourceCount;
    summary.goodCount = result.goodCount;
    summary.warningCount = result.warningCount;
    summary.badCount = result.badCount;
    summary.unknownCount = result.unknownCount;
  } catch (error) {
    console.error("加载样本统计失败：", error);
  }
}

/** 加载样本列表。 */
async function loadSampleList(): Promise<void> {
  loading.value = true;

  try {
    const result = await SignSampleAPI.list({
      resourceCode: queryForm.resourceCode || undefined,
      qualityStatus: queryForm.qualityStatus || undefined,
      deleted: queryForm.deleted === "true",
      page: queryForm.page,
      pageSize: queryForm.pageSize,
    });

    sampleList.value = result.items;
    total.value = result.total;
    queryForm.page = result.page;
    queryForm.pageSize = result.pageSize;
  } catch (error) {
    console.error("加载样本列表失败：", error);
  } finally {
    loading.value = false;
  }
}

/** 查询样本。 */
function handleSearch(): void {
  queryForm.page = 1;
  loadSampleList();
}

/** 重置查询。 */
function resetQuery(): void {
  queryForm.resourceCode = "";
  queryForm.qualityStatus = "";
  queryForm.deleted = "false";
  queryForm.page = 1;
  queryForm.pageSize = 20;
  loadSampleList();
}

/** 刷新统计和列表。 */
async function refreshAll(): Promise<void> {
  await Promise.all([loadSummary(), loadSampleList()]);
}

/** 打开质量标记弹窗。 */
function openQualityDialog(row: SignSampleItem): void {
  currentSample.value = row;
  qualityForm.qualityStatus = row.qualityStatus || "BAD";
  qualityForm.qualityMessage = row.qualityMessage || "";
  qualityDialogVisible.value = true;
}

/** 提交质量状态更新。 */
async function handleUpdateQuality(): Promise<void> {
  if (!currentSample.value) {
    return;
  }

  qualitySubmitLoading.value = true;

  try {
    await SignSampleAPI.updateQuality(currentSample.value.id, {
      qualityStatus: qualityForm.qualityStatus,
      qualityMessage: qualityForm.qualityMessage,
    });

    ElMessage.success("样本质量状态已更新");
    qualityDialogVisible.value = false;

    await refreshAll();
  } catch (error) {
    console.error("更新样本质量失败：", error);
  } finally {
    qualitySubmitLoading.value = false;
  }
}

/** 删除样本。 */
async function handleDelete(row: SignSampleItem): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `确定删除样本「${row.sampleCode}」吗？该操作为软删除。`,
      "删除确认",
      {
        type: "warning",
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      }
    );

    await SignSampleAPI.delete(row.id);
    ElMessage.success("样本已删除");

    await refreshAll();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除样本失败：", error);
    }
  }
}

/** 格式化比例为百分比。 */
function formatRatio(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(1)}%`;
}

/** 格式化数字。 */
function formatNumber(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return Number(value).toFixed(2);
}

/** 格式化时长。 */
function formatDuration(durationMs?: number): string {
  if (durationMs === undefined || durationMs === null) {
    return "-";
  }

  return `${(durationMs / 1000).toFixed(2)}s`;
}

/** 获取质量状态中文名称。 */
function qualityLabel(status: SignSampleQualityStatus): string {
  const map: Record<SignSampleQualityStatus, string> = {
    UNKNOWN: "未知",
    GOOD: "良好",
    WARNING: "警告",
    BAD: "异常",
  };

  return map[status] || status;
}

/** 获取质量状态标签类型。 */
function qualityTagType(
  status: SignSampleQualityStatus
): "success" | "warning" | "danger" | "info" {
  const map: Record<SignSampleQualityStatus, "success" | "warning" | "danger" | "info"> = {
    UNKNOWN: "info",
    GOOD: "success",
    WARNING: "warning",
    BAD: "danger",
  };

  return map[status] || "info";
}

/** 组件挂载后加载初始数据。 */
onMounted(async () => {
  await loadResourceOptions();
  await refreshAll();
});
</script>
