/**
 * canvas画正方形框-框住脸部
 */
export function drawSquare(
  data: any[],
  rectSize: number[],
  scale: number,
  scaleY: number
) {
  //获得canvas画布
  var canvas = document.getElementById("myCanvas");
  //得到画布的上下文
  var ctx = (canvas as any).getContext("2d");
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach(
    (item: { position: number[]; size: number[]; landmarks: any }) => {
      // 居中偏移量+坐标*缩放比
      const left = rectSize[0] + item.position[0] * scale;
      const right = rectSize[1] + item.position[1] * scaleY;
      const top = item.size[0] * scale;
      const bottom = item.size[1] * scaleY;
      ctx.rect(left, right, top, bottom);
      ctx.strokeStyle = "red"; // 设置或返回用于描边的颜色
      ctx.stroke();
      // 绘制五官

      drawFace(item.landmarks, item.size, left, right, scale, scaleY);
    }
  );
}
// 标记出面部轮廓
export const drawFace = (
  data: string | any[],
  size: number[],
  xPosition: number,
  yPosition: number,
  scale: number,
  scaleY: number
) => {
  //获得canvas画布
  var canvas = document.getElementById("myCanvas");
  //得到画布的上下文
  var ctx = (canvas as any).getContext("2d");
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const x = Math.floor(item[0] * scale * size[0]) + xPosition;
    const y = Math.floor(item[1] * scaleY * size[1]) + yPosition;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red"; // 设置或返回用于描边的颜色
    ctx.moveTo(x, y); //坐标起点
    ctx.lineTo(x + 2, y + 2); //终点,或者理解为下一个点
    ctx.fillStyle = "red"; // 设置或返回用于填充绘画的颜色
    ctx.stroke();
  }
};

export const getImageUrlToBase64 = (url: string) => {
  const img = new Image();
  img.crossOrigin = "anonymous"; //处理跨域，后端也要设置跨域处理才行
  img.src = url;
  console.log(img);
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas"); //创建一个canvas元素
      canvas.width = img.width; //把当前url对应的图片的宽度赋予canvas
      canvas.height = img.height; //把当前url对应的图片的高度赋予canvas
      const ctx = canvas.getContext("2d");
      (ctx as any).drawImage(img, 0, 0, canvas.width, canvas.height); //在画布上一比一的画出img
      const base64 = canvas.toDataURL("image/jpeg"); //调用canvas的toDataURL获取.jpg的base64数据
      //转base64
      const file = base64ToFile(base64);
      resolve({
        file,
      });
    };
  });
};
export function base64ToFile(base64: string) {
  let filename = "file.png";
  var arr = base64.split(","),
    mime = (arr[0] as any).match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  let suffixArr = mime.split("/");
  if (suffixArr.length && !filename) {
    let suffix = suffixArr[suffixArr.length - 1];
    filename =
      new Date().getTime() +
      "-" +
      Math.floor(Math.random() * 10000) +
      "." +
      suffix;
  }
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  let file = new File([u8arr], filename, { type: mime });
  return file;
}

export function drawLpr(data: any[], rectSize: number[], scale: number) {
  //获得canvas画布
  var canvas = document.getElementById("myCanvas");
  //得到画布的上下文
  var ctx = (canvas as any).getContext("2d");
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((item: { box: number[] }) => {
    // 居中偏移量+坐标*缩放比
    const left = rectSize[0] + item.box[0] * scale;
    const right = rectSize[1] + item.box[1] * scale;
    const top = (item.box[2] - item.box[0]) * scale;
    const bottom = (item.box[3] - item.box[1]) * scale;
    ctx.rect(left, right, top, bottom);
    ctx.strokeStyle = "red"; // 设置或返回用于描边的颜色
    ctx.stroke();
  });
}
export function drawObjSquare(
  data: any[],
  rectSize: any[],
  scale: number,
  newScale: number,
  key = "position"
) {
  console.log("data==", data, rectSize, scale);
  //获得canvas画布
  var canvas = document.getElementById("myCanvas");
  //得到画布的上下文
  var ctx = (canvas as any).getContext("2d");
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((item: { [x: string]: any[]; name: any }) => {
    // 居中偏移量+坐标*缩放比
    const left = rectSize[0] + item[key][0] * scale;
    const right = rectSize[1] + item[key][1] * scale;
    const top = (item[key][2] - item[key][0]) * scale;
    const bottom = (item[key][3] - item[key][1]) * scale;
    console.log(rectSize[0], item[key][0], scale);
    ctx.rect(left, right, top, bottom);
    ctx.strokeStyle = "red"; // 设置或返回用于描边的颜色
    ctx.stroke();
    ctx.moveTo(left + 10, right);
    ctx.fillStyle = "red";
    // ctx.fillRect(left-80, right, 80, 40)
    ctx.font = "bold 18px Arial";
    // ctx.fillStyle = 'red'
    ctx.textAlign = "center";
    ctx.fillText(item.name, left + 45, right + 25);
  });
}

export function drawTextSquare(
  data: any[],
  rectSize: number[],
  xPosition: number,
  yPosition: number
) {
  //获得canvas画布
  var canvas = document.getElementById("myCanvas");
  //得到画布的上下文
  var ctx = (canvas as any).getContext("2d");
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((item: { area: number[][] }) => {
    ctx.strokeStyle = "red";
    ctx.moveTo(
      item.area[0][0] * xPosition + rectSize[0],
      item.area[0][1] * yPosition + rectSize[1]
    );
    ctx.lineTo(
      item.area[1][0] * xPosition + rectSize[0],
      item.area[1][1] * yPosition + rectSize[1]
    );
    ctx.lineTo(
      item.area[2][0] * xPosition + rectSize[0],
      item.area[2][1] * yPosition + rectSize[1]
    );
    ctx.lineTo(
      item.area[3][0] * xPosition + rectSize[0],
      item.area[3][1] * yPosition + rectSize[1]
    );
    ctx.lineTo(
      item.area[0][0] * xPosition + rectSize[0],
      item.area[0][1] * yPosition + rectSize[1]
    );
    ctx.stroke();
  });
}
