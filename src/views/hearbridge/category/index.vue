<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-base font-bold">手势分类管理</div>
            <div class="mt-1 text-sm text-gray-500">第一阶段只读展示后端已有手势分类数据。</div>
          </div>

          <el-button type="primary" :loading="loading" @click="loadCategoryList">刷新</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="categoryList" border>
        <el-table-column prop="id" label="ID" width="90" align="center" />

        <el-table-column prop="code" label="分类编码" min-width="160" />

        <el-table-column prop="nameZh" label="中文名称" min-width="160" />

        <el-table-column label="封面" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.coverUrl"
              :src="row.coverUrl"
              fit="cover"
              class="h-14 w-20 rounded"
              :preview-src-list="[row.coverUrl]"
              preview-teleported
            />
            <span v-else class="text-gray-400">无</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="coverObjectKey"
          label="封面对象 Key"
          min-width="260"
          show-overflow-tooltip
        />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SignCategoryAPI from "@/api/hearbridge/sign-category";
import type { SignCategoryItem } from "../../../types/api/hearbridge/sign-category";

/** 页面加载状态。 */
const loading = ref(false);

/** 手势分类列表。 */
const categoryList = ref<SignCategoryItem[]>([]);

/** 加载手势分类列表。 */
async function loadCategoryList(): Promise<void> {
  loading.value = true;

  try {
    categoryList.value = await SignCategoryAPI.list();
  } catch (error) {
    console.error("加载手势分类列表失败：", error);
  } finally {
    loading.value = false;
  }
}

/** 组件挂载后自动加载数据。 */
onMounted(() => {
  loadCategoryList();
});
</script>
