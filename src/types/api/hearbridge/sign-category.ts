/**
 * 手势分类列表项。
 *
 * 对应后端 SignCategory 实体当前返回字段。
 */
export interface SignCategoryItem {
  /** 主键 ID。 */
  id: number;

  /** 分类编码。 */
  code: string;

  /** 分类中文名称。 */
  nameZh: string;

  /** 分类封面在 MinIO 中的对象 Key。 */
  coverObjectKey: string;

  /** 分类封面完整访问地址。 */
  coverUrl: string;
}
