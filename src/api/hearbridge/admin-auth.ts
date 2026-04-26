import hearbridgeRequest from "./hearbridge-request";
import type {
  AdminChangePasswordRequest,
  AdminLoginRequest,
  AdminLoginResult,
  AdminUserInfo,
} from "@/types/api";

/** 管理端认证接口基础路径。 */
const ADMIN_AUTH_BASE_URL = "/admin/auth";

/** 管理端认证 API。 */
const AdminAuthAPI = {
  login(data: AdminLoginRequest) {
    return hearbridgeRequest.post<any, AdminLoginResult>(`${ADMIN_AUTH_BASE_URL}/login`, data);
  },

  me() {
    return hearbridgeRequest.get<any, AdminUserInfo>(`${ADMIN_AUTH_BASE_URL}/me`);
  },

  logout() {
    return hearbridgeRequest.post<any, void>(`${ADMIN_AUTH_BASE_URL}/logout`);
  },

  changePassword(data: AdminChangePasswordRequest) {
    return hearbridgeRequest.put<any, { message: string }>(`${ADMIN_AUTH_BASE_URL}/password`, data);
  },
};

export default AdminAuthAPI;
