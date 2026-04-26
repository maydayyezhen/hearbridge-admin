/**
 * 文件上传结果。
 *
 * 对应后端 FileUploadResult。
 */
export interface FileUploadResult {
  /** MinIO 桶名称。 */
  bucket: string;

  /** MinIO 对象 Key，数据库建议保存这个字段。 */
  objectKey: string;

  /** 浏览器可直接访问的完整 URL。 */
  url: string;

  /** 原始文件名。 */
  originalFileName: string;

  /** 文件类型。 */
  contentType: string;

  /** 文件大小，单位 byte。 */
  size: number;
}
