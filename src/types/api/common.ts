/**
 * 通用 API 类型定义
 */

/** API 响应结构 */
export interface ApiResponse<T = any> {
  /** 响应码 */
  code: string;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  msg: string;
}

/** 基础查询参数 */
export interface BaseQueryParams {
  /** 页码 */
  pageNum: number;
  /** 每页记录数 */
  pageSize: number;

  /** 排序字段 */
  sortBy?: string;

  /** 排序方式（正序:ASC；反序:DESC） */
  order?: string;
}

/** 分页数据结构（模板旧接口） */
export interface PageResult<T> {
  /** 数据列表 */
  list: T[];
  /** 总记录数 */
  total: number;
}

/** 听桥后端通用分页响应。 */
export interface HearBridgePageResult<T> {
  /** 当前页数据。 */
  records: T[];

  /** 总记录数。 */
  total: number;

  /** 当前页码，从 1 开始。 */
  pageNo: number;

  /** 每页数量。 */
  pageSize: number;

  /** 总页数。 */
  totalPages: number;

  /** 是否还有下一页。 */
  hasNext: boolean;
}

/** 下拉选项 */
export interface OptionItem {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label: string;
  /** 子选项 */
  children?: OptionItem[];
}

/** Excel 导入结果 */
export interface ExcelResult {
  /** 响应码 */
  code: string;
  /** 无效数据数量 */
  invalidCount: number;
  /** 有效数据数量 */
  validCount: number;
  /** 错误信息列表 */
  messageList: string[];
}
