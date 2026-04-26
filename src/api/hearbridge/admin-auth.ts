import hearbridgeRequest from "./hearbridge-request";
import type { AdminLoginRequest, AdminLoginResult, AdminUserInfo } from "@/types/api";

/** 管理端认证接口基础路径。 */
const ADMIN_AUTH_BASE_URL = "/admin/auth";

/** 管理端认证 API。 */
const AdminAuthAPI = {
  /** 管理员登录。 */
  login(data: AdminLoginRequest) {
    return hearbridgeRequest.post<any, AdminLoginResult>(`${ADMIN_AUTH_BASE_URL}/login`, data);
  },

  /** 获取当前管理员信息。 */
  me() {
    return hearbridgeRequest.get<any, AdminUserInfo>(`${ADMIN_AUTH_BASE_URL}/me`);
  },

  /** 退出登录。 */
  logout() {
    return hearbridgeRequest.post<any, void>(`${ADMIN_AUTH_BASE_URL}/logout`);
  },
};

export default AdminAuthAPI;
