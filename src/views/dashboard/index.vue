<template>
  <div class="hearbridge-dashboard">
    <el-card shadow="never" class="hero-card">
      <div class="hero-content">
        <div>
          <div class="hero-badge">HearBridge Admin</div>
          <h1 class="hero-title">听桥后台管理概览</h1>
          <p class="hero-subtitle">
            管理手势资源、样本数据、模型训练与模型发布，形成从手机端采集到 Python
            识别服务生效的完整闭环。
          </p>
        </div>

        <div class="hero-actions">
          <el-button type="primary" @click="router.push('/hearbridge/samples')">
            进入样本管理
          </el-button>
          <el-button @click="refreshAll">刷新概览</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16" class="mt-4">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="metric-card" @click="router.push('/hearbridge/categories')">
          <div class="metric-label">手势分类</div>
          <div class="metric-value">{{ categoryCount }}</div>
          <div class="metric-desc">分类管理与封面维护</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="metric-card" @click="router.push('/hearbridge/resources')">
          <div class="metric-label">手势资源</div>
          <div class="metric-value">{{ resourceCount }}</div>
          <div class="metric-desc">手势编码、图片、SiGML 资源</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="metric-card" @click="router.push('/hearbridge/samples')">
          <div class="metric-label">raw 样本</div>
          <div class="metric-value">{{ sampleSummary.totalCount }}</div>
          <div class="metric-desc">覆盖资源 {{ sampleSummary.resourceCount }} 个</div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card
          shadow="never"
          class="metric-card"
          @click="router.push('/hearbridge/model-versions')"
        >
          <div class="metric-label">模型版本</div>
          <div class="metric-value">{{ modelVersionCount }}</div>
          <div class="metric-desc">当前发布：{{ publishedVersion?.versionName || "暂无" }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-4">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>样本质量概览</span>
              <el-button type="primary" link @click="router.push('/hearbridge/samples')">
                查看样本
              </el-button>
            </div>
          </template>

          <el-row :gutter="12">
            <el-col :span="6">
              <div class="quality-item good">
                <div class="quality-value">{{ sampleSummary.goodCount }}</div>
                <div class="quality-label">良好</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quality-item warning">
                <div class="quality-value">{{ sampleSummary.warningCount }}</div>
                <div class="quality-label">警告</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quality-item bad">
                <div class="quality-value">{{ sampleSummary.badCount }}</div>
                <div class="quality-label">异常</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quality-item unknown">
                <div class="quality-value">{{ sampleSummary.unknownCount }}</div>
                <div class="quality-label">未知</div>
              </div>
            </el-col>
          </el-row>

          <el-divider />

          <div class="pipeline">
            <div class="pipeline-step done">raw 样本采集</div>
            <div class="pipeline-arrow">→</div>
            <div class="pipeline-step done">样本同步</div>
            <div class="pipeline-arrow">→</div>
            <div class="pipeline-step done">特征转换</div>
            <div class="pipeline-arrow">→</div>
            <div class="pipeline-step done">模型训练</div>
            <div class="pipeline-arrow">→</div>
            <div class="pipeline-step done">模型发布</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>当前发布模型</span>
              <el-button type="primary" link @click="router.push('/hearbridge/model-versions')">
                管理版本
              </el-button>
            </div>
          </template>

          <el-empty v-if="!publishedVersion" description="暂无发布模型" />

          <el-descriptions v-else :column="1" border>
            <el-descriptions-item label="版本名称">
              {{ publishedVersion.versionName }}
            </el-descriptions-item>
            <el-descriptions-item label="样本数">
              {{ publishedVersion.sampleCount }}
            </el-descriptions-item>
            <el-descriptions-item label="类别数">
              {{ publishedVersion.classCount }}
            </el-descriptions-item>
            <el-descriptions-item label="验证准确率">
              <el-tag type="success">
                {{ formatPercent(publishedVersion.finalValAccuracy) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="模型路径">
              <span class="path-text">{{ publishedVersion.modelPath }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
          <span class="header-tip">按演示流程从左到右操作</span>
        </div>
      </template>

      <div class="quick-actions">
        <el-button type="primary" plain @click="router.push('/hearbridge/categories')">
          手势分类管理
        </el-button>
        <el-button type="primary" plain @click="router.push('/hearbridge/resources')">
          手势资源管理
        </el-button>
        <el-button type="success" plain @click="router.push('/hearbridge/samples')">
          样本同步 / 特征转换
        </el-button>
        <el-button type="warning" plain @click="router.push('/hearbridge/training')">
          模型训练
        </el-button>
        <el-button type="danger" plain @click="router.push('/hearbridge/model-versions')">
          模型版本发布
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SignCategoryAPI from "@/api/hearbridge/sign-category";
import SignResourceAPI from "@/api/hearbridge/sign-resource";
import SignSampleAPI from "@/api/hearbridge/sign-sample";
import ModelVersionAPI from "@/api/hearbridge/model-version";
import type { SignModelVersionItem, SignSampleSummary } from "@/types/api";

/** 路由实例。 */
const router = useRouter();

/** 手势分类数量。 */
const categoryCount = ref(0);

/** 手势资源数量。 */
const resourceCount = ref(0);

/** 模型版本数量。 */
const modelVersionCount = ref(0);

/** 当前发布模型版本。 */
const publishedVersion = ref<SignModelVersionItem | null>(null);

/** 样本统计。 */
const sampleSummary = reactive<SignSampleSummary>({
  totalCount: 0,
  resourceCount: 0,
  goodCount: 0,
  warningCount: 0,
  badCount: 0,
  unknownCount: 0,
});

/**
 * 刷新全部概览数据。
 */
async function refreshAll(): Promise<void> {
  const [categories, resources, summary, versions, published] = await Promise.all([
    SignCategoryAPI.list(),
    SignResourceAPI.list(),
    SignSampleAPI.summary(),
    ModelVersionAPI.list(),
    ModelVersionAPI.getPublished().catch(() => null),
  ]);

  categoryCount.value = categories.length;
  resourceCount.value = resources.length;
  modelVersionCount.value = versions.length;
  publishedVersion.value = published;

  sampleSummary.totalCount = summary.totalCount || 0;
  sampleSummary.resourceCount = summary.resourceCount || 0;
  sampleSummary.goodCount = summary.goodCount || 0;
  sampleSummary.warningCount = summary.warningCount || 0;
  sampleSummary.badCount = summary.badCount || 0;
  sampleSummary.unknownCount = summary.unknownCount || 0;
}

/**
 * 格式化百分比。
 *
 * @param value 小数形式准确率
 * @returns 百分比文本
 */
function formatPercent(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(2)}%`;
}

/** 页面挂载后加载概览数据。 */
onMounted(() => {
  refreshAll();
});
</script>

<style lang="scss" scoped>
.hearbridge-dashboard {
  padding: 24px;
}

.mt-4 {
  margin-top: 16px;
}

.hero-card {
  background:
    radial-gradient(circle at 0 0, rgba(64, 158, 255, 0.16), transparent 28%),
    linear-gradient(135deg, rgba(64, 158, 255, 0.08), rgba(103, 194, 58, 0.08));
}

.hero-content {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.hero-badge {
  display: inline-flex;
  padding: 4px 10px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-radius: 999px;
}

.hero-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: var(--el-text-color-primary);
}

.hero-subtitle {
  max-width: 760px;
  margin: 10px 0 0;
  line-height: 1.7;
  color: var(--el-text-color-secondary);
}

.hero-actions {
  display: flex;
  gap: 10px;
  white-space: nowrap;
}

.metric-card {
  height: 150px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--el-box-shadow-light);
    transform: translateY(-2px);
  }
}

.metric-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.metric-value {
  margin-top: 18px;
  font-size: 34px;
  font-weight: 800;
  color: var(--el-text-color-primary);
}

.metric-desc {
  margin-top: 10px;
  font-size: 13px;
  color: var(--el-text-color-placeholder);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
}

.header-tip {
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
}

.quality-item {
  padding: 18px 8px;
  text-align: center;
  border-radius: 12px;
}

.quality-value {
  font-size: 24px;
  font-weight: 800;
}

.quality-label {
  margin-top: 6px;
  font-size: 13px;
}

.good {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.warning {
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
}

.bad {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}

.unknown {
  color: var(--el-color-info);
  background: var(--el-color-info-light-9);
}

.pipeline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.pipeline-step {
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 999px;
}

.pipeline-step.done {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.pipeline-arrow {
  color: var(--el-text-color-placeholder);
}

.path-text {
  word-break: break-all;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions {
    flex-wrap: wrap;
  }
}
</style>
