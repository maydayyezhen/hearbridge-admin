<template>
  <div class="hb-image-upload">
    <el-upload
      :show-file-list="false"
      :http-request="handleUpload"
      :before-upload="beforeUpload"
      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
    >
      <div
        v-if="previewUrl"
        class="relative h-28 w-40 overflow-hidden rounded border border-dashed border-gray-300"
      >
        <el-image
          :src="previewUrl"
          fit="cover"
          class="h-full w-full"
          :preview-src-list="[previewUrl]"
          preview-teleported
        />

        <div
          class="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white opacity-0 transition hover:opacity-100"
        >
          点击更换
        </div>
      </div>

      <div
        v-else
        class="flex h-28 w-40 flex-col items-center justify-center rounded border border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary"
      >
        <el-icon class="mb-2 text-2xl">
          <Plus />
        </el-icon>
        <span class="text-sm">上传图片</span>
      </div>
    </el-upload>

    <div v-if="modelValue" class="mt-2 text-xs text-gray-400">
      {{ modelValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import type { UploadRequestOptions } from "element-plus";
import FileUploadAPI from "@/api/hearbridge/file-upload";

/** 组件参数。 */
const props = withDefaults(
  defineProps<{
    /** 当前绑定的 MinIO objectKey。 */
    modelValue?: string;

    /** 当前图片预览 URL。 */
    url?: string;

    /** 上传业务类型。 */
    bizType?: string;

    /** 图片最大大小，单位 MB。 */
    maxSizeMb?: number;
  }>(),
  {
    modelValue: "",
    url: "",
    bizType: "sign-category-cover",
    maxSizeMb: 10,
  }
);

/** 组件事件。 */
const emit = defineEmits<{
  /** 更新 objectKey。 */
  "update:modelValue": [value: string];

  /** 更新图片 URL。 */
  "update:url": [value: string];

  /** 上传成功事件。 */
  uploaded: [payload: { objectKey: string; url: string }];
}>();

/** 图片预览地址。 */
const previewUrl = ref(props.url || "");

/** 监听外部 URL 变化。 */
watch(
  () => props.url,
  (value) => {
    previewUrl.value = value || "";
  }
);

/**
 * 上传前校验。
 *
 * @param file 待上传文件
 * @returns 是否允许上传
 */
function beforeUpload(file: File): boolean {
  const allowTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowTypes.includes(file.type)) {
    ElMessage.error("只允许上传 jpg、png、webp 图片");
    return false;
  }

  const maxBytes = props.maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    ElMessage.error(`图片大小不能超过 ${props.maxSizeMb}MB`);
    return false;
  }

  return true;
}

/**
 * 自定义上传逻辑。
 *
 * @param options Element Plus 上传参数
 */
async function handleUpload(options: UploadRequestOptions): Promise<void> {
  try {
    const result = await FileUploadAPI.upload({
      file: options.file as File,
      bizType: props.bizType,
    });

    previewUrl.value = result.url;

    emit("update:modelValue", result.objectKey);
    emit("update:url", result.url);
    emit("uploaded", {
      objectKey: result.objectKey,
      url: result.url,
    });

    ElMessage.success("图片上传成功");
    options.onSuccess?.(result);
  } catch (error) {
    console.error("图片上传失败：", error);
    options.onError?.(error as Error);
  }
}
</script>
