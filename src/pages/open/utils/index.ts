import { message } from "antd";

export const beforeUploadImg = (file: File) => {
  const ext = file.name.split(".").pop()?.toLocaleLowerCase() ?? "";
  if (!["jpg", "png", "jpeg", "bmp"].includes(ext)) {
    message.error("请上传jpg、png、jpeg、bmp格式的图片");
    return false;
  }
  if (file.size > 1024 * 1024 * 10) {
    message.error("图片大小不能超过10M");
    return false;
  }
  return true;
};

// 获取适配的尺寸
export const getAdaptSize = ({
  img,
  containerW,
  containerH,
}: {
  img: HTMLImageElement;
  containerW: number;
  containerH: number;
}) => {
  const containerRatio = containerW / containerH;
  const { width, height } = img;
  const ratio = width / height;

  if (ratio > containerRatio) {
    const min_w = Math.min(width, containerW);
    return [min_w, height / (width / min_w)];
  } else {
    const min_h = Math.min(height, containerH);
    return [width / (height / min_h), min_h];
  }
};
