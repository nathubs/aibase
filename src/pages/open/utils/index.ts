import { message } from "antd";

export const beforeUploadImg = (file: File) => {
  const ext = file.name.split(".").pop()?.toLocaleLowerCase() ?? "";
  if (!["jpg", "png", "jpeg", "bmp"].includes(ext)) {
    message.error("请上传jpg、png、jpeg格式的图片");
    return false;
  }
  if (file.size > 1024 * 1024 * 10) {
    message.error("图片大小不能超过10M");
    return false;
  }
  return true;
};
