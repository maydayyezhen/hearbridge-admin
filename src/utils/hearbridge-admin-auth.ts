/** 管理端 token 本地存储 key。 */
const ADMIN_TOKEN_KEY = "hearbridge_admin_token";

/** 管理端用户信息本地存储 key。 */
const ADMIN_USER_KEY = "hearbridge_admin_user";

/**
 * 获取管理端 token。
 */
export function getAdminToken(): string {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

/**
 * 保存管理端 token。
 *
 * @param token 登录 token
 */
export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

/**
 * 删除管理端 token。
 */
export function removeAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/**
 * 保存管理端用户信息。
 *
 * @param user 用户信息
 */
export function setAdminUser(user: unknown): void {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user || {}));
}

/**
 * 获取管理端用户信息。
 */
export function getAdminUser<T = unknown>(): T | null {
  const text = localStorage.getItem(ADMIN_USER_KEY);
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * 删除管理端用户信息。
 */
export function removeAdminUser(): void {
  localStorage.removeItem(ADMIN_USER_KEY);
}

/**
 * 清理管理端登录态。
 */
export function clearAdminAuth(): void {
  removeAdminToken();
  removeAdminUser();
}
