<template>
  <div class="relative p-6">
    <!-- 顶部项目概览 -->
    <el-card shadow="never" class="mt-2">
      <div class="flex flex-wrap">
        <!-- 左侧问候语区域 -->
        <div class="flex-1 flex items-start">
          <div class="w80px h80px rounded-full flex-center bg-[--el-color-primary-light-9]">
            <el-icon :size="38" color="var(--el-color-primary)">
              <DataAnalysis />
            </el-icon>
          </div>

          <div class="ml-5">
            <p class="text-base font-semibold text-[--el-text-color-primary] leading-tight">
              {{ greetings }}
            </p>
            <p class="text-sm text-gray">
              当前系统已接入手势资源、raw 样本、模型训练与模型版本发布流程。
            </p>
          </div>
        </div>

        <!-- 右侧项目入口 - PC端 -->
        <div class="hidden sm:block">
          <div class="flex items-end space-x-6">
            <!-- 仓库 -->
            <div>
              <div class="font-bold color-#ff9a2e text-sm flex items-center">
                <el-icon class="mr-2px"><Folder /></el-icon>
                项目仓库
              </div>
              <div class="mt-3 whitespace-nowrap">
                <el-link href="https://github.com/maydayyezhen/hearbridge_frontend" target="_blank">
                  <div class="i-svg:github text-lg color-#4080FF" />
                </el-link>
                <el-divider direction="vertical" />
                <el-link href="https://github.com/maydayyezhen/hearbridge_backend" target="_blank">
                  <div class="i-svg:github text-lg color-#67C23A" />
                </el-link>
                <el-divider direction="vertical" />
                <el-link href="https://github.com/maydayyezhen/MySssb" target="_blank">
                  <div class="i-svg:github text-lg color-#F76560" />
                </el-link>
                <el-divider direction="vertical" />
                <el-link href="https://github.com/maydayyezhen/hearbridge-admin" target="_blank">
                  <div class="i-svg:github text-lg color-#7C3AED" />
                </el-link>
              </div>
            </div>

            <!-- 演示流程 -->
            <div>
              <div class="font-bold color-#4080ff text-sm flex items-center">
                <el-icon class="mr-2px"><Document /></el-icon>
                演示流程
              </div>
              <div class="mt-3 whitespace-nowrap">
                <el-link type="primary" @click="router.push('/hearbridge/samples')">样本</el-link>
                <el-divider direction="vertical" />
                <el-link type="primary" @click="router.push('/hearbridge/training')">训练</el-link>
                <el-divider direction="vertical" />
                <el-link type="primary" @click="router.push('/hearbridge/model-versions')">
                  发布
                </el-link>
              </div>
            </div>

            <!-- 训练闭环 -->
            <div>
              <div class="font-bold color-#f76560 text-sm flex items-center">
                <el-icon class="mr-2px"><VideoCamera /></el-icon>
                训练闭环
              </div>
              <div class="mt-3 whitespace-nowrap">
                <el-tag v-if="publishedVersion" type="success" size="small">已发布模型</el-tag>
                <el-tag v-else type="info" size="small">暂无发布</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动端快捷入口 -->
        <div class="w-full sm:hidden mt-3">
          <div class="flex justify-end space-x-4 overflow-x-auto">
            <el-link type="primary" @click="router.push('/hearbridge/categories')">分类</el-link>
            <el-link type="primary" @click="router.push('/hearbridge/resources')">资源</el-link>
            <el-link type="primary" @click="router.push('/hearbridge/samples')">样本</el-link>
            <el-link type="primary" @click="router.push('/hearbridge/model-versions')">
              模型
            </el-link>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 数据统计 -->
    <el-row :gutter="10" class="mt-5">
      <!-- 手势分类数量 -->
      <el-col :span="8" :xs="24" class="mb-xs-3">
        <el-card
          shadow="never"
          class="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          @click="router.push('/hearbridge/categories')"
        >
          <template #header>
            <div class="flex-x-between">
              <span class="text-xs font-medium text-[--el-text-color-secondary]">手势分类</span>
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs leading-5 rounded-full border select-none"
                  :class="sseStatusClass"
                >
                  <el-icon class="text-sm">
                    <Loading v-if="!isConnected && connectionState === 'CONNECTING'" />
                    <CircleCheck v-else-if="isConnected" />
                    <CircleClose v-else />
                  </el-icon>
                  <span class="text-[--el-text-color-secondary]">DATA</span>
                  <span class="font-medium">{{ sseStatusText }}</span>
                </span>
              </div>
            </div>
          </template>

          <div class="mt-2 flex-1 flex items-end">
            <div class="flex items-baseline gap-1.5">
              <span class="text-xl font-semibold tracking-wide">{{ onlineUserCount }}</span>
              <span class="text-xs text-[--el-text-color-secondary]">类</span>
            </div>
          </div>

          <div class="mt-2 flex justify-between items-center">
            <span class="text-sm text-gray">更新时间</span>
            <span class="text-sm">{{ formattedTime }}</span>
          </div>
        </el-card>
      </el-col>

      <!-- 手势资源数量 -->
      <el-col :span="8" :xs="24" class="mb-xs-3">
        <el-skeleton :loading="visitStatsLoading" :rows="5" animated>
          <template #template>
            <el-card>
              <template #header>
                <div>
                  <el-skeleton-item variant="h3" style="width: 40%" />
                  <el-skeleton-item variant="rect" style="float: right; width: 1em; height: 1em" />
                </div>
              </template>

              <div class="flex-x-between">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="circle" style="width: 2em; height: 2em" />
              </div>
              <div class="mt-5 flex-x-between">
                <el-skeleton-item variant="text" style="width: 50%" />
                <el-skeleton-item variant="text" style="width: 1em" />
              </div>
            </el-card>
          </template>

          <template v-if="!visitStatsLoading">
            <el-card
              shadow="never"
              class="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              @click="router.push('/hearbridge/resources')"
            >
              <template #header>
                <div class="flex-x-between">
                  <span class="text-xs font-medium text-[--el-text-color-secondary]">手势资源</span>
                  <el-tag type="success" size="small">Resource</el-tag>
                </div>
              </template>

              <div class="mt-2 flex-1 flex items-end">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-xl font-semibold tracking-wide">
                    {{ displayTransitionUvCount }}
                  </span>
                  <span
                    v-if="uvGrowthText !== null"
                    :class="['text-xs', computeGrowthRateClass(visitStatsData.uvGrowthRate)]"
                  >
                    <el-icon
                      v-if="
                        visitStatsData.uvGrowthRate !== undefined &&
                        visitStatsData.uvGrowthRate !== null
                      "
                    >
                      <Top v-if="visitStatsData.uvGrowthRate > 0" />
                      <Bottom v-else-if="visitStatsData.uvGrowthRate < 0" />
                    </el-icon>
                    {{ uvGrowthText }}
                  </span>
                </div>
              </div>

              <div class="mt-2 flex justify-between items-center">
                <span class="text-sm text-gray">模型版本数</span>
                <span class="text-sm">{{ displayTransitionTotalUvCount }}</span>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>

      <!-- raw 样本数量 -->
      <el-col :span="8" :xs="24">
        <el-skeleton :loading="visitStatsLoading" :rows="5" animated>
          <template #template>
            <el-card>
              <template #header>
                <div>
                  <el-skeleton-item variant="h3" style="width: 40%" />
                  <el-skeleton-item variant="rect" style="float: right; width: 1em; height: 1em" />
                </div>
              </template>

              <div class="flex-x-between">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="circle" style="width: 2em; height: 2em" />
              </div>
              <div class="mt-5 flex-x-between">
                <el-skeleton-item variant="text" style="width: 50%" />
                <el-skeleton-item variant="text" style="width: 1em" />
              </div>
            </el-card>
          </template>

          <template v-if="!visitStatsLoading">
            <el-card
              shadow="never"
              class="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              @click="router.push('/hearbridge/samples')"
            >
              <template #header>
                <div class="flex-x-between">
                  <span class="text-xs font-medium text-[--el-text-color-secondary]">raw 样本</span>
                  <el-tag type="primary" size="small">Dataset</el-tag>
                </div>
              </template>

              <div class="mt-2 flex-1 flex items-end">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-xl font-semibold tracking-wide">
                    {{ displayTransitionPvCount }}
                  </span>
                  <span
                    v-if="pvGrowthText !== null"
                    :class="['text-xs', computeGrowthRateClass(visitStatsData.pvGrowthRate)]"
                  >
                    <el-icon
                      v-if="
                        visitStatsData.pvGrowthRate !== undefined &&
                        visitStatsData.pvGrowthRate !== null
                      "
                    >
                      <Top v-if="visitStatsData.pvGrowthRate > 0" />
                      <Bottom v-else-if="visitStatsData.pvGrowthRate < 0" />
                    </el-icon>
                    {{ pvGrowthText }}
                  </span>
                </div>
              </div>

              <div class="mt-2 flex justify-between items-center">
                <span class="text-sm text-gray">覆盖资源数</span>
                <span class="text-sm">{{ displayTransitionTotalPvCount }}</span>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mt-5">
      <!-- 模型准确率趋势图 -->
      <el-col :xs="24" :span="16">
        <el-card>
          <template #header>
            <div class="flex-x-between">
              <span>模型准确率趋势</span>
              <el-radio-group v-model="visitTrendDateRange" size="small">
                <el-radio-button label="近5个版本" :value="5" />
                <el-radio-button label="近8个版本" :value="8" />
              </el-radio-group>
            </div>
          </template>
          <ECharts :options="visitTrendChartOptions" height="400px" />
        </el-card>
      </el-col>

      <!-- 最近访问 -->
      <el-col :xs="24" :span="8">
        <el-card>
          <template #header>
            <div class="flex-x-between">
              <span class="font-semibold">最近访问模块</span>
              <el-button
                v-if="recentMenus.length > 0"
                type="primary"
                link
                size="small"
                @click="clearRecentMenus"
              >
                清空
              </el-button>
            </div>
          </template>

          <div class="min-h-[400px] flex flex-col">
            <!-- 宫格显示 -->
            <div v-if="recentMenus.length > 0" class="grid grid-cols-2 gap-3">
              <div
                v-for="item in recentMenus"
                :key="item.path"
                class="group flex items-center gap-2 px-3 py-2.5 bg-[--el-fill-color-lighter] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[--el-color-primary-light-8]"
                @click="router.push(item.path)"
              >
                <!-- 图标 -->
                <div class="shrink-0 w-8 h-8 flex items-center justify-center">
                  <el-icon
                    v-if="item.icon?.startsWith('el-icon-')"
                    class="text-lg text-[--el-color-primary]"
                  >
                    <component :is="item.icon.replace('el-icon-', '')" />
                  </el-icon>
                  <div
                    v-else-if="item.icon"
                    :class="`i-svg:${item.icon} text-lg text-[--el-color-primary]`"
                  />
                  <el-icon v-else class="text-lg text-[--el-color-primary]"><Menu /></el-icon>
                </div>

                <!-- 标题 -->
                <span class="text-sm truncate flex-1 leading-tight">
                  {{ item.title }}
                </span>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="flex flex-col items-center justify-center flex-1 py-16">
              <el-icon :size="48" class="text-[--el-text-color-placeholder] mb-4">
                <Clock />
              </el-icon>
              <p class="text-sm text-[--el-text-color-secondary] mb-2">暂无访问记录</p>
              <p class="text-xs text-[--el-text-color-placeholder]">
                访问的管理模块会自动记录在这里
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方补充信息 -->
    <el-row :gutter="10" class="mt-5">
      <el-col :xs="24" :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="flex-x-between">
              <span class="font-semibold">样本质量概览</span>
              <el-button type="primary" link @click="router.push('/hearbridge/samples')">
                查看样本
              </el-button>
            </div>
          </template>

          <el-row :gutter="12">
            <el-col :span="6">
              <div class="quality-card good">
                <div class="quality-value">{{ sampleSummary.goodCount }}</div>
                <div class="quality-label">良好</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quality-card warning">
                <div class="quality-value">{{ sampleSummary.warningCount }}</div>
                <div class="quality-label">警告</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quality-card bad">
                <div class="quality-value">{{ sampleSummary.badCount }}</div>
                <div class="quality-label">异常</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="quality-card unknown">
                <div class="quality-value">{{ sampleSummary.unknownCount }}</div>
                <div class="quality-label">未知</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :xs="24" :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="flex-x-between">
              <span class="font-semibold">当前发布模型</span>
              <el-button type="primary" link @click="router.push('/hearbridge/model-versions')">
                管理版本
              </el-button>
            </div>
          </template>

          <el-empty v-if="!publishedVersion" description="暂无发布模型" />

          <el-descriptions v-else :column="2" border>
            <el-descriptions-item label="版本">
              {{ publishedVersion.versionName }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag type="success">{{ publishedVersion.status }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="样本数">
              {{ publishedVersion.sampleCount }}
            </el-descriptions-item>
            <el-descriptions-item label="类别数">
              {{ publishedVersion.classCount }}
            </el-descriptions-item>
            <el-descriptions-item label="训练准确率">
              {{ formatPercent(publishedVersion.finalTrainAccuracy) }}
            </el-descriptions-item>
            <el-descriptions-item label="验证准确率">
              {{ formatPercent(publishedVersion.finalValAccuracy) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import { useRouter } from "vue-router";
import { useTransition, useDateFormat } from "@vueuse/core";
import {
  Bottom,
  CircleCheck,
  CircleClose,
  Clock,
  DataAnalysis,
  Document,
  Folder,
  Loading,
  Menu,
  Top,
  VideoCamera,
} from "@element-plus/icons-vue";

import SignCategoryAPI from "@/api/hearbridge/sign-category";
import SignResourceAPI from "@/api/hearbridge/sign-resource";
import SignSampleAPI from "@/api/hearbridge/sign-sample";
import ModelVersionAPI from "@/api/hearbridge/model-version";
import { getAdminUser } from "@/utils/hearbridge-admin-auth";
import { useRecentMenus } from "@/composables";

import type {
  AdminUserInfo,
  SignCategoryItem,
  SignModelVersionItem,
  SignResourceItem,
  SignSampleSummary,
} from "@/types/api";

const router = useRouter();

/** 当前管理员。 */
const adminUser = computed(() => {
  return (
    getAdminUser<AdminUserInfo>() || {
      id: 0,
      username: "admin",
      nickname: "管理员",
    }
  );
});

/** 最近访问菜单，继续沿用模板能力。 */
const { recentMenus, clearRecentMenus } = useRecentMenus();

/** 业务数据。 */
const categories = ref<SignCategoryItem[]>([]);
const resources = ref<SignResourceItem[]>([]);
const modelVersions = ref<SignModelVersionItem[]>([]);
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

/** 页面加载状态。 */
const visitStatsLoading = ref(true);

/** 原模板第一张卡片变量：这里复用为手势分类数。 */
const onlineUserCount = computed(() => categories.value.length);

/** 原模板 SSE 状态变量：这里改成系统数据状态展示。 */
const isConnected = ref(true);
const connectionState = ref("CONNECTED");
const lastUpdateTime = ref(new Date());

const formattedTime = computed(() => {
  return useDateFormat(lastUpdateTime, "HH:mm:ss").value;
});

const sseStatusText = computed(() => {
  return isConnected.value ? "正常" : "异常";
});

const sseStatusClass = computed(() => {
  if (isConnected.value) {
    return "text-[--el-color-success] bg-[--el-color-success-light-9] border-[--el-color-success-light-7]";
  }

  return connectionState.value === "CONNECTING"
    ? "text-[--el-color-warning] bg-[--el-color-warning-light-9] border-[--el-color-warning-light-7]"
    : "text-[--el-color-danger] bg-[--el-color-danger-light-9] border-[--el-color-danger-light-7]";
});

/** 问候语。 */
const greetings = computed(() => {
  const nickname = adminUser.value.nickname || adminUser.value.username || "管理员";
  const hours = new Date().getHours();

  if (hours >= 6 && hours < 12) {
    return `上午好，${nickname}！欢迎回到听桥管理端`;
  }

  if (hours >= 12 && hours < 18) {
    return `下午好，${nickname}！继续完善训练闭环`;
  }

  return `晚上好，${nickname}！今天也辛苦了`;
});

/**
 * 原模板 visitStatsData：
 * todayUvCount 复用为资源数量；
 * totalUvCount 复用为模型版本数量；
 * todayPvCount 复用为 raw 样本总数；
 * totalPvCount 复用为覆盖资源数量。
 */
const visitStatsData = ref({
  todayUvCount: 0,
  uvGrowthRate: 0,
  totalUvCount: 0,
  todayPvCount: 0,
  pvGrowthRate: 0,
  totalPvCount: 0,
});

const uvGrowthText = computed(() => {
  return `模型版本 ${visitStatsData.value.totalUvCount}`;
});

const pvGrowthText = computed(() => {
  return `覆盖资源 ${visitStatsData.value.totalPvCount}`;
});

const transitionUvCount = useTransition(
  computed(() => visitStatsData.value.todayUvCount),
  {
    duration: 1000,
    transition: [0.25, 0.1, 0.25, 1.0],
  }
);

const transitionTotalUvCount = useTransition(
  computed(() => visitStatsData.value.totalUvCount),
  {
    duration: 1200,
    transition: [0.25, 0.1, 0.25, 1.0],
  }
);

const transitionPvCount = useTransition(
  computed(() => visitStatsData.value.todayPvCount),
  {
    duration: 1000,
    transition: [0.25, 0.1, 0.25, 1.0],
  }
);

const transitionTotalPvCount = useTransition(
  computed(() => visitStatsData.value.totalPvCount),
  {
    duration: 1200,
    transition: [0.25, 0.1, 0.25, 1.0],
  }
);

const displayTransitionUvCount = computed(() =>
  Math.round(Number((transitionUvCount as any)?.value ?? transitionUvCount))
);

const displayTransitionTotalUvCount = computed(() =>
  Math.round(Number((transitionTotalUvCount as any)?.value ?? transitionTotalUvCount))
);

const displayTransitionPvCount = computed(() =>
  Math.round(Number((transitionPvCount as any)?.value ?? transitionPvCount))
);

const displayTransitionTotalPvCount = computed(() =>
  Math.round(Number((transitionTotalPvCount as any)?.value ?? transitionTotalPvCount))
);

/** 图表展示最近几个模型版本。 */
const visitTrendDateRange = ref(8);

/** 模型准确率趋势图。 */
const visitTrendChartOptions = ref();

/** 刷新业务数据。 */
async function fetchVisitStatsData(): Promise<void> {
  visitStatsLoading.value = true;

  try {
    const [categoryData, resourceData, summaryData, versionData, publishedData] = await Promise.all(
      [
        SignCategoryAPI.list(),
        SignResourceAPI.list(),
        SignSampleAPI.summary(),
        ModelVersionAPI.list(),
        ModelVersionAPI.getPublished().catch(() => null),
      ]
    );

    categories.value = categoryData;
    resources.value = resourceData;
    modelVersions.value = versionData;
    publishedVersion.value = publishedData;
    lastUpdateTime.value = new Date();

    sampleSummary.totalCount = summaryData.totalCount || 0;
    sampleSummary.resourceCount = summaryData.resourceCount || 0;
    sampleSummary.goodCount = summaryData.goodCount || 0;
    sampleSummary.warningCount = summaryData.warningCount || 0;
    sampleSummary.badCount = summaryData.badCount || 0;
    sampleSummary.unknownCount = summaryData.unknownCount || 0;

    visitStatsData.value = {
      todayUvCount: resourceData.length,
      uvGrowthRate: versionData.length,
      totalUvCount: versionData.length,
      todayPvCount: summaryData.totalCount || 0,
      pvGrowthRate: summaryData.resourceCount || 0,
      totalPvCount: summaryData.resourceCount || 0,
    };

    updateVisitTrendChartOptions();
  } finally {
    visitStatsLoading.value = false;
  }
}

/** 更新模型准确率趋势图。 */
function updateVisitTrendChartOptions(): void {
  const recentVersions = [...modelVersions.value]
    .sort((a, b) => (a.id || 0) - (b.id || 0))
    .slice(-visitTrendDateRange.value);

  visitTrendChartOptions.value = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => `${Number(value).toFixed(2)}%`,
    },
    legend: {
      data: ["训练准确率", "验证准确率"],
      bottom: 0,
    },
    grid: {
      left: "1%",
      right: "5%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: recentVersions.map((item) => item.versionName.replace("train_", "")),
      axisLabel: {
        rotate: 20,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: {
        formatter: "{value}%",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "训练准确率",
        type: "line",
        data: recentVersions.map((item) => toPercentNumber(item.finalTrainAccuracy)),
        areaStyle: {
          color: "rgba(64, 158, 255, 0.1)",
        },
        smooth: true,
        itemStyle: {
          color: "#4080FF",
        },
        lineStyle: {
          color: "#4080FF",
        },
      },
      {
        name: "验证准确率",
        type: "line",
        data: recentVersions.map((item) => toPercentNumber(item.finalValAccuracy)),
        areaStyle: {
          color: "rgba(103, 194, 58, 0.1)",
        },
        smooth: true,
        itemStyle: {
          color: "#67C23A",
        },
        lineStyle: {
          color: "#67C23A",
        },
      },
    ],
  };
}

/** 兼容原模板的增长率颜色函数。 */
function computeGrowthRateClass(value?: number): string {
  if (!value) {
    return "text-[--el-color-info]";
  }

  return value > 0 ? "text-[--el-color-success]" : "text-[--el-color-info]";
}

/** 转百分数。 */
function toPercentNumber(value?: number): number {
  if (value === undefined || value === null) {
    return 0;
  }

  return Number((Number(value) * 100).toFixed(2));
}

/** 格式化百分比。 */
function formatPercent(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }

  return `${toPercentNumber(value).toFixed(2)}%`;
}

/** 切换展示版本数量时刷新图表。 */
watch(
  () => visitTrendDateRange.value,
  () => {
    updateVisitTrendChartOptions();
  }
);

onMounted(() => {
  fetchVisitStatsData();
});
</script>

<style lang="scss" scoped>
.quality-card {
  padding: 16px 8px;
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
</style>
