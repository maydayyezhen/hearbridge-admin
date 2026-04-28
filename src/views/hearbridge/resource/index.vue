<template>
  <div class="app-container">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-base font-bold">手势资源管理</div>
            <div class="mt-1 text-sm text-gray-500">
              支持手势资源新增、编辑、删除，支持资源封面和 SiGML 文件上传。
            </div>
          </div>

          <el-button type="primary" @click="openCreateDialog">新增资源</el-button>
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
          <el-button type="primary" :loading="loading" @click="handleQuery">查询</el-button>
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
      :title="dialogMode === 'create' ? '新增手势资源' : '编辑手势资源'"
      width="640px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px">
        <el-form-item label="资源编码" prop="code">
          <el-input v-model="formModel.code" placeholder="例如：hello" clearable />
        </el-form-item>

        <el-form-item label="中文名称" prop="nameZh">
          <el-input v-model="formModel.nameZh" placeholder="例如：你好" clearable />
        </el-form-item>

        <el-form-item label="所属分类" prop="categoryCode">
          <el-select
            v-model="formModel.categoryCode"
            filterable
            placeholder="请选择分类"
            class="w-full"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.code"
              :label="`${item.nameZh}（${item.code}）`"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="资源封面" prop="coverObjectKey">
          <HbImageUpload
            v-model="formModel.coverObjectKey"
            v-model:url="formCoverUrl"
            biz-type="sign-resource-cover"
          />
        </el-form-item>

        <el-form-item label="SiGML 文件" prop="sigmlObjectKey">
          <div class="w-full">
            <el-upload
              :show-file-list="false"
              :http-request="handleSigmlUpload"
              :before-upload="beforeSigmlUpload"
              accept=".sigml,.xml"
            >
              <el-button :loading="sigmlUploadLoading">上传 SiGML</el-button>
            </el-upload>

            <div v-if="formModel.sigmlObjectKey" class="mt-2 text-xs text-gray-500">
              {{ formModel.sigmlObjectKey }}
            </div>

            <el-link
              v-if="formSigmlUrl"
              class="mt-2"
              type="primary"
              :href="formSigmlUrl"
              target="_blank"
            >
              查看已上传 SiGML
            </el-link>
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
import type { FormInstance, FormRules, UploadRequestOptions } from "element-plus";
import SignCategoryAPI from "@/api/hearbridge/sign-category";
import SignResourceAPI from "@/api/hearbridge/sign-resource";
import FileUploadAPI from "@/api/hearbridge/file-upload";
import HbImageUpload from "@/components/HbImageUpload/index.vue";
import type { SignCategoryItem } from "@/types/api/hearbridge/sign-category";
import type {
  SignResourceItem,
  SignResourceSaveParams,
} from "@/types/api/hearbridge/sign-resource";

/** 弹窗模式。 */
type DialogMode = "create" | "edit";

/** 页面加载状态。 */
const loading = ref(false);

/** 分类选项加载状态。 */
const categoryLoading = ref(false);

/** 表单提交状态。 */
const submitLoading = ref(false);

/** SiGML 上传状态。 */
const sigmlUploadLoading = ref(false);

/** 弹窗是否显示。 */
const dialogVisible = ref(false);

/** 当前弹窗模式。 */
const dialogMode = ref<DialogMode>("create");

/** 当前编辑的资源 ID。 */
const editingId = ref<number | null>(null);

/** 表单实例。 */
const formRef = ref<FormInstance>();

/** 查询表单。 */
const queryForm = reactive({
  /** 分类编码。 */
  categoryCode: "",
});

/** 分页状态。 */
const pageState = reactive({
  /** 当前页码。 */
  pageNo: 1,

  /** 每页数量。 */
  pageSize: 20,

  /** 总记录数。 */
  total: 0,
});

/** 手势分类选项。 */
const categoryOptions = ref<SignCategoryItem[]>([]);

/** 手势资源列表。 */
const resourceList = ref<SignResourceItem[]>([]);

/** 表单封面预览 URL。 */
const formCoverUrl = ref("");

/** 表单 SiGML 预览 URL。 */
const formSigmlUrl = ref("");

/** 表单数据。 */
const formModel = reactive<SignResourceSaveParams>({
  /** 资源编码。 */
  code: "",

  /** 资源中文名称。 */
  nameZh: "",

  /** 所属分类编码。 */
  categoryCode: "",

  /** 资源封面对象 Key。 */
  coverObjectKey: "",

  /** SiGML 文件对象 Key。 */
  sigmlObjectKey: "",
});

/** 表单校验规则。 */
const formRules = reactive<FormRules<SignResourceSaveParams>>({
  code: [
    { required: true, message: "请输入资源编码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "资源编码只能包含字母、数字、下划线和短横线",
      trigger: "blur",
    },
  ],
  nameZh: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
  categoryCode: [{ required: true, message: "请选择所属分类", trigger: "change" }],
});

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

/** 加载手势资源分页。 */
async function loadResourcePage(): Promise<void> {
  loading.value = true;

  try {
    const page = await SignResourceAPI.page({
      categoryCode: queryForm.categoryCode || undefined,
      pageNo: pageState.pageNo,
      pageSize: pageState.pageSize,
    });
    resourceList.value = page.records;
    pageState.total = page.total;
  } catch (error) {
    console.error("加载手势资源分页失败：", error);
  } finally {
    loading.value = false;
  }
}

/** 查询资源。 */
function handleQuery(): void {
  pageState.pageNo = 1;
  loadResourcePage();
}

/** 每页数量变化。 */
function handlePageSizeChange(pageSize: number): void {
  pageState.pageSize = pageSize;
  pageState.pageNo = 1;
  loadResourcePage();
}

/** 当前页变化。 */
function handleCurrentPageChange(pageNo: number): void {
  pageState.pageNo = pageNo;
  loadResourcePage();
}

/** 重置查询条件。 */
function resetQuery(): void {
  queryForm.categoryCode = "";
  pageState.pageNo = 1;
  loadResourcePage();
}

/** 重置表单。 */
function resetForm(): void {
  formModel.code = "";
  formModel.nameZh = "";
  formModel.categoryCode = queryForm.categoryCode || "";
  formModel.coverObjectKey = "";
  formModel.sigmlObjectKey = "";

  formCoverUrl.value = "";
  formSigmlUrl.value = "";
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
function openEditDialog(row: SignResourceItem): void {
  dialogMode.value = "edit";
  dialogVisible.value = true;
  editingId.value = row.id;

  formModel.code = row.code;
  formModel.nameZh = row.nameZh;
  formModel.categoryCode = row.categoryCode;
  formModel.coverObjectKey = row.coverObjectKey || "";
  formModel.sigmlObjectKey = row.sigmlObjectKey || "";

  formCoverUrl.value = row.coverUrl || "";
  formSigmlUrl.value = row.sigmlUrl || "";
}

/** SiGML 上传前校验。 */
function beforeSigmlUpload(file: File): boolean {
  const lowerName = file.name.toLowerCase();

  if (!lowerName.endsWith(".sigml") && !lowerName.endsWith(".xml")) {
    ElMessage.error("只允许上传 .sigml 或 .xml 文件");
    return false;
  }

  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error("SiGML 文件大小不能超过 2MB");
    return false;
  }

  return true;
}

/** 上传 SiGML 文件。 */
async function handleSigmlUpload(options: UploadRequestOptions): Promise<void> {
  sigmlUploadLoading.value = true;

  try {
    const result = await FileUploadAPI.upload({
      file: options.file as File,
      bizType: "sign-resource-sigml",
    });

    formModel.sigmlObjectKey = result.objectKey;
    formSigmlUrl.value = result.url;

    ElMessage.success("SiGML 上传成功");
    options.onSuccess?.(result);
  } catch (error) {
    console.error("SiGML 上传失败：", error);
    options.onError?.(error as Error);
  } finally {
    sigmlUploadLoading.value = false;
  }
}

/** 提交表单。 */
async function handleSubmit(): Promise<void> {
  if (!formRef.value) {
    return;
  }

  await formRef.value.validate();

  submitLoading.value = true;

  try {
    const payload: SignResourceSaveParams = {
      code: formModel.code.trim(),
      nameZh: formModel.nameZh.trim(),
      categoryCode: formModel.categoryCode,
      coverObjectKey: formModel.coverObjectKey?.trim() || "",
      sigmlObjectKey: formModel.sigmlObjectKey?.trim() || "",
    };

    if (dialogMode.value === "create") {
      await SignResourceAPI.create(payload);
      ElMessage.success("新增资源成功");
      pageState.pageNo = 1;
    } else {
      if (editingId.value == null) {
        ElMessage.error("缺少资源 ID，无法更新");
        return;
      }

      await SignResourceAPI.update(editingId.value, payload);
      ElMessage.success("更新资源成功");
    }

    dialogVisible.value = false;
    await loadResourcePage();
  } catch (error) {
    console.error("保存手势资源失败：", error);
  } finally {
    submitLoading.value = false;
  }
}

/** 删除资源。 */
async function handleDelete(row: SignResourceItem): Promise<void> {
  try {
    await ElMessageBox.confirm(`确定删除资源「${row.nameZh}（${row.code}）」吗？`, "删除确认", {
      type: "warning",
      confirmButtonText: "删除",
      cancelButtonText: "取消",
    });

    await SignResourceAPI.delete(row.id);
    ElMessage.success("删除资源成功");
    await loadResourcePage();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除手势资源失败：", error);
    }
  }
}

/** 组件挂载后加载初始数据。 */
onMounted(async () => {
  await loadCategoryOptions();
  await loadResourcePage();
});
</script>
