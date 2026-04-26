/**
 * 管理端登录请求。
 */
export interface AdminLoginRequest {
  /** 用户名。 */
  username: string;

  /** 密码。 */
  password: string;
}

/**
 * 管理端用户信息。
 */
export interface AdminUserInfo {
  /** 管理员 ID。 */
  id: number;

  /** 用户名。 */
  username: string;

  /** 昵称。 */
  nickname: string;
}

/**
 * 管理端登录结果。
 */
export interface AdminLoginResult {
  /** 登录 token。 */
  token: string;

  /** 当前用户信息。 */
  user: AdminUserInfo;
}
