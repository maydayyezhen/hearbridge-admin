import hearbridgeRequest from "./hearbridge-request";
import type { FileUploadResult } from "@/types/api/hearbridge/file-upload";

/** 文件上传接口基础路径。 */
const FILE_UPLOAD_BASE_URL = "/files/upload";

/** 文件上传参数。 */
export interface FileUploadParams {
  /** 上传文件。 */
  file: File;

  /** 上传业务类型。 */
  bizType: string;
}

/** 文件上传 API。 */
const FileUploadAPI = {
  /**
   * 上传文件。
   *
   * @param params 上传参数
   * @returns 上传结果
   */
  upload(params: FileUploadParams) {
    const formData = new FormData();

    formData.append("file", params.file);
    formData.append("bizType", params.bizType);

    return hearbridgeRequest.post<any, FileUploadResult>(FILE_UPLOAD_BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default FileUploadAPI;
