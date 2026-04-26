/**
 * 手势资源列表项。
 *
 * 对应后端 SignResource 实体当前返回字段。
 */
export interface SignResourceItem {
  /** 主键 ID。 */
  id: number;

  /** 资源编码。 */
  code: string;

  /** 资源中文名称。 */
  nameZh: string;

  /** 所属分类编码。 */
  categoryCode: string;

  /** SiGML 文件在 MinIO 中的对象 Key。 */
  sigmlObjectKey: string;

  /** 封面图片在 MinIO 中的对象 Key。 */
  coverObjectKey: string;

  /** SiGML 文件完整访问地址。 */
  sigmlUrl: string;

  /** 封面图片完整访问地址。 */
  coverUrl: string;
}

/**
 * 手势资源保存参数。
 */
export interface SignResourceSaveParams {
  /** 资源编码。 */
  code: string;

  /** 资源中文名称。 */
  nameZh: string;

  /** 所属分类编码。 */
  categoryCode: string;

  /** SiGML 文件对象 Key。 */
  sigmlObjectKey?: string;

  /** 封面图片对象 Key。 */
  coverObjectKey?: string;
}
