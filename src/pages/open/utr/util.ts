const readFile = (file: Blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });

const loadImg: (dataUrl: any) => Promise<HTMLImageElement> = (dataUrl: any) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = function () {
      resolve(img);
    };
  });

const drawImg = (img: HTMLImageElement) => {
  const canvas = document.getElementById("myCanvas")! as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  const scale = Math.min(
    Math.min(canvas.width / img.width, canvas.height / img.height),
    1
  );

  // 清除画布
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img_w = img.width * scale;
  const img_h = img.height * scale;
  const rectSize = [(canvas.width - img_w) / 2, (canvas.height - img_h) / 2];
  ctx.drawImage(
    img,
    rectSize[0],
    rectSize[1],
    img.width * scale,
    img.height * scale
  );

  return {
    rectSize,
    scale,
  };
};

export const beforeUploadImage = async (file: Blob) => {
  const dataUrl = await readFile(file);
  const img = await loadImg(dataUrl);
  return drawImg(img);
};
