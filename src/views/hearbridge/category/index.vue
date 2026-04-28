<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-base font-bold">手势分类管理</div>
            <div class="mt-1 text-sm text-gray-500">
              第二阶段：支持手势分类新增、编辑、删除。当前图片先通过 MinIO 对象 Key 维护。
            </div>
          </div>

          <div class="flex gap-2">
            <el-button :loading="loading" @click="loadCategoryPage">刷新</el-button>
            <el-button type="primary" @click="openCreateDialog">新增分类</el-button>
          </div>
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

        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pageState.pageNo"
          v-model:page-size="pageState.pageSize"
          :total="pageState.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增手势分类' : '编辑手势分类'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="110px">
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="formModel.code" placeholder="例如：daily_greeting" clearable />
        </el-form-item>

        <el-form-item label="中文名称" prop="nameZh">
          <el-input v-model="formModel.nameZh" placeholder="例如：日常问候" clearable />
        </el-form-item>

        <el-form-item label="封面对象 Key" prop="coverObjectKey">
          <el-input
            v-model="formModel.coverObjectKey"
            placeholder="例如：sign/category/daily_greeting.png"
            clearable
          />
          <div class="mt-1 text-xs text-gray-400">
            当前阶段先手动填写 MinIO 对象 Key；下一步再接入统一上传组件。
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import SignCategoryAPI from "@/api/hearbridge/sign-category";
import type {
  SignCategoryItem,
  SignCategorySaveParams,
} from "@/types/api/hearbridge/sign-category";

/** 分类弹窗模式。 */
type DialogMode = "create" | "edit";

/** 页面加载状态。 */
const loading = ref(false);

/** 表单提交状态。 */
const submitLoading = ref(false);

/** 弹窗是否显示。 */
const dialogVisible = ref(false);

/** 当前弹窗模式。 */
const dialogMode = ref<DialogMode>("create");

/** 当前编辑的分类 ID。 */
const editingId = ref<number | null>(null);

/** 表单实例。 */
const formRef = ref<FormInstance>();

/** 手势分类列表。 */
const categoryList = ref<SignCategoryItem[]>([]);

/** 分页状态。 */
const pageState = reactive({
  /** 当前页码。 */
  pageNo: 1,

  /** 每页数量。 */
  pageSize: 20,

  /** 总记录数。 */
  total: 0,
});

/** 表单数据。 */
const formModel = reactive<SignCategorySaveParams>({
  /** 分类编码。 */
  code: "",

  /** 分类中文名称。 */
  nameZh: "",

  /** 分类封面对象 Key。 */
  coverObjectKey: "",
});

/** 表单校验规则。 */
const formRules = reactive<FormRules<SignCategorySaveParams>>({
  code: [
    { required: true, message: "请输入分类编码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "分类编码只能包含字母、数字、下划线和短横线",
      trigger: "blur",
    },
  ],
  nameZh: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
});

/** 加载手势分类分页。 */
async function loadCategoryPage(): Promise<void> {
  loading.value = true;

  try {
    const page = await SignCategoryAPI.page({
      pageNo: pageState.pageNo,
      pageSize: pageState.pageSize,
    });
    categoryList.value = page.records;
    pageState.total = page.total;
  } catch (error) {
    console.error("加载手势分类分页失败：", error);
  } finally {
    loading.value = false;
  }
}

/** 每页数量变化。 */
function handlePageSizeChange(pageSize: number): void {
  pageState.pageSize = pageSize;
  pageState.pageNo = 1;
  loadCategoryPage();
}

/** 当前页变化。 */
function handleCurrentPageChange(pageNo: number): void {
  pageState.pageNo = pageNo;
  loadCategoryPage();
}

/** 重置表单。 */
function resetForm(): void {
  formModel.code = "";
  formModel.nameZh = "";
  formModel.coverObjectKey = "";
  editingId.value = null;
  formRef.value?.clearValidate();
}

/** 打开新增弹窗。 */
function openCreateDialog(): void {
  dialogMode.value = "create";
  dialogVisible.value = true;
  resetForm();
}

/** 打开编辑弹窗。 */
function openEditDialog(row: SignCategoryItem): void {
  dialogMode.value = "edit";
  dialogVisible.value = true;
  editingId.value = row.id;

  formModel.code = row.code;
  formModel.nameZh = row.nameZh;
  formModel.coverObjectKey = row.coverObjectKey || "";
}

/** 提交表单。 */
async function handleSubmit(): Promise<void> {
  if (!formRef.value) {
    return;
  }

  await formRef.value.validate();

  submitLoading.value = true;

  try {
    const payload: SignCategorySaveParams = {
      code: formModel.code.trim(),
      nameZh: formModel.nameZh.trim(),
      coverObjectKey: formModel.coverObjectKey?.trim() || "",
    };

    if (dialogMode.value === "create") {
      await SignCategoryAPI.create(payload);
      ElMessage.success("新增分类成功");
      pageState.pageNo = 1;
    } else {
      if (editingId.value == null) {
        ElMessage.error("缺少分类 ID，无法更新");
        return;
      }

      await SignCategoryAPI.update(editingId.value, payload);
      ElMessage.success("更新分类成功");
    }

    dialogVisible.value = false;
    await loadCategoryPage();
  } catch (error) {
    console.error("保存手势分类失败：", error);
  } finally {
    submitLoading.value = false;
  }
}

/** 删除分类。 */
async function handleDelete(row: SignCategoryItem): Promise<void> {
  try {
    await ElMessageBox.confirm(`确定删除分类「${row.nameZh}（${row.code}）」吗？`, "删除确认", {
      type: "warning",
      confirmButtonText: "删除",
      cancelButtonText: "取消",
    });

    await SignCategoryAPI.delete(row.id);
    ElMessage.success("删除分类成功");
    await loadCategoryPage();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除手势分类失败：", error);
    }
  }
}

/** 组件挂载后自动加载数据。 */
onMounted(() => {
  loadCategoryPage();
});
</script>
