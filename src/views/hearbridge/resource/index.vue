<template>
  <div class="app-container">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div>
          <div class="text-base font-bold">手势资源管理</div>
          <div class="mt-1 text-sm text-gray-500">
            第一阶段只读展示后端已有手势资源数据，支持按分类筛选。
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryForm">
        <el-form-item label="分类">
          <el-select
            v-model="queryForm.categoryCode"
            clearable
            filterable
            placeholder="请选择分类"
            :loading="categoryLoading"
            class="w-56"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.code"
              :label="`${item.nameZh}（${item.code}）`"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="loadResourceList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="resourceList" border>
        <el-table-column prop="id" label="ID" width="90" align="center" />

        <el-table-column prop="code" label="资源编码" min-width="160" />

        <el-table-column prop="nameZh" label="中文名称" min-width="160" />

        <el-table-column prop="categoryCode" label="分类编码" min-width="140" />

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

        <el-table-column label="SiGML" min-width="160">
          <template #default="{ row }">
            <el-link v-if="row.sigmlUrl" type="primary" :href="row.sigmlUrl" target="_blank">
              查看文件
            </el-link>
            <span v-else class="text-gray-400">无</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="coverObjectKey"
          label="封面对象 Key"
          min-width="240"
          show-overflow-tooltip
        />

        <el-table-column
          prop="sigmlObjectKey"
          label="SiGML 对象 Key"
          min-width="240"
          show-overflow-tooltip
        />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SignCategoryAPI from "@/api/hearbridge/sign-category";
import SignResourceAPI from "@/api/hearbridge/sign-resource";
import type { SignCategoryItem } from "../../../types/api/hearbridge/sign-category";
import type { SignResourceItem } from "../../../types/api/hearbridge/sign-resource";

/** 页面加载状态。 */
const loading = ref(false);

/** 分类选项加载状态。 */
const categoryLoading = ref(false);

/** 查询表单。 */
const queryForm = reactive({
  /** 分类编码。 */
  categoryCode: "",
});

/** 手势分类选项。 */
const categoryOptions = ref<SignCategoryItem[]>([]);

/** 手势资源列表。 */
const resourceList = ref<SignResourceItem[]>([]);

/** 加载分类选项。 */
async function loadCategoryOptions(): Promise<void> {
  categoryLoading.value = true;

  try {
    categoryOptions.value = await SignCategoryAPI.list();
  } catch (error) {
    console.error("加载分类选项失败：", error);
  } finally {
    categoryLoading.value = false;
  }
}

/** 加载手势资源列表。 */
async function loadResourceList(): Promise<void> {
  loading.value = true;

  try {
    resourceList.value = await SignResourceAPI.list({
      categoryCode: queryForm.categoryCode || undefined,
    });
  } catch (error) {
    console.error("加载手势资源列表失败：", error);
  } finally {
    loading.value = false;
  }
}

/** 重置查询条件。 */
function resetQuery(): void {
  queryForm.categoryCode = "";
  loadResourceList();
}

/** 组件挂载后加载初始数据。 */
onMounted(async () => {
  await loadCategoryOptions();
  await loadResourceList();
});
</script>
