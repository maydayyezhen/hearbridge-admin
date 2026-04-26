<template>
  <div class="hearbridge-login-form">
    <div class="login-title-wrap">
      <h3 class="login-title">听桥管理端登录</h3>
      <p class="login-subtitle">HearBridge Admin Console</p>
    </div>

    <el-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginRules"
      size="large"
      :validate-on-rule-change="false"
    >
      <el-form-item prop="username">
        <el-input
          v-model.trim="loginFormData.username"
          placeholder="请输入管理员账号"
          clearable
          @keyup.enter="handleLoginSubmit"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model.trim="loginFormData.password"
          placeholder="请输入管理员密码"
          type="password"
          show-password
          clearable
          @keyup="checkCapsLock"
          @keyup.enter="handleLoginSubmit"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-alert
        v-if="isCapsLock"
        type="warning"
        show-icon
        :closable="false"
        title="检测到大写锁定已开启"
        class="mb-4"
      />

      <el-form-item>
        <el-button :loading="loading" type="primary" class="w-full" @click="handleLoginSubmit">
          登录管理端
        </el-button>
      </el-form-item>
    </el-form>

    <div class="login-tip">
      <el-text size="small" type="info">默认测试账号：admin / admin123456</el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import router from "@/router";
import AdminAuthAPI from "@/api/hearbridge/admin-auth";
import type { AdminLoginRequest } from "@/types/api";
import { setAdminToken, setAdminUser } from "@/utils/hearbridge-admin-auth";

/** 当前路由。 */
const route = useRoute();

/** 登录表单引用。 */
const loginFormRef = ref<FormInstance>();

/** 登录加载状态。 */
const loading = ref(false);

/** 是否大写锁定。 */
const isCapsLock = ref(false);

/** 登录表单数据。 */
const loginFormData = reactive<AdminLoginRequest>({
  username: "admin",
  password: "admin123456",
});

/** 登录表单校验规则。 */
const loginRules: FormRules = {
  username: [
    {
      required: true,
      trigger: "blur",
      message: "请输入管理员账号",
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: "请输入管理员密码",
    },
    {
      min: 6,
      trigger: "blur",
      message: "密码长度不能少于 6 位",
    },
  ],
};

/**
 * 提交登录。
 */
async function handleLoginSubmit(): Promise<void> {
  const valid = await loginFormRef.value?.validate().then(
    () => true,
    () => false
  );

  if (!valid) {
    return;
  }

  loading.value = true;

  try {
    const result = await AdminAuthAPI.login(loginFormData);

    setAdminToken(result.token);
    setAdminUser(result.user);

    ElMessage.success(`欢迎回来，${result.user.nickname || result.user.username}`);

    const redirectPath = (route.query.redirect as string) || "/hearbridge/categories";
    await router.push(decodeURIComponent(redirectPath));
  } finally {
    loading.value = false;
  }
}

/**
 * 检查大写锁定。
 *
 * @param event 键盘事件
 */
function checkCapsLock(event: KeyboardEvent): void {
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}
</script>

<style lang="scss" scoped>
.hearbridge-login-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-title-wrap {
  margin-bottom: 0.75rem;
  text-align: center;
}

.login-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.login-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}

.login-tip {
  text-align: center;
}
</style>
