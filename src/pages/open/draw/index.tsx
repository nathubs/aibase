import { UploadOutlined } from "@ant-design/icons";
import ApplyList from "../component/applyList";
import Banner from "../component/banner";
import Special from "../component/special";
import styles from "./index.module.less";
import { Button, Select, Slider, Upload, UploadFile, message } from "antd";
import { useMount, useUnmount } from "ahooks";
import { CanvasDraw } from "./canvas-draw";
import { CSSProperties, useRef, useState } from "react";
import { base64ToFile } from "../faceCheck/draw-face";
import httpService from "@/service/httpService";
import { API } from "@/service/api";
import { beforeUploadImg, getAdaptSize } from "../utils";

const options = [
  {
    value: "spring",
    label: "spring",
  },
  {
    value: "winter",
    label: "winter",
  },
  {
    value: "blue",
    label: "blue",
  },
];

const WIDTH = 638;

const Draw = () => {
  const constant = useRef<{
    instance?: CanvasDraw;
    imageIns?: {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      drew?: boolean;
    };
  }>();
  const [type, setType] = useState("pen");
  const [imgStyle, setImgStyle] = useState("spring");
  const [imgValue, setImgValue] = useState(1);

  const onChangeLineWidth = (value: number) => {
    constant.current?.instance?.changeLineWidth(value);
    setImgValue(6);
  };

  useMount(() => {
    const imgCanvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
    imgCanvas.width = WIDTH;
    imgCanvas.height = WIDTH;
    constant.current = {
      instance: new CanvasDraw(),
      imageIns: {
        canvas: imgCanvas,
        ctx: imgCanvas.getContext("2d")!,
      },
    };
  });

  useUnmount(() => {
    constant.current?.instance?.destroy();
  });

  const changeType = () => {
    const newType = type === "pen" ? "eraser" : "pen";
    setType(newType);
    if (newType === "pen") {
      onChangeLineWidth(6);
    } else {
      onChangeLineWidth(30);
    }
    constant.current?.instance?.eraser();
  };

  const convertCanvasToImage = () => {
    const base64 = constant.current?.instance?.myCanvas.toDataURL("image/png")!;
    //转base64
    const file = base64ToFile(base64);
    return file;
  };

  const drawPicture = () => {
    const formData: any = new FormData();

    formData.append("image", convertCanvasToImage());
    formData.append("style", imgStyle);
    formData.append("factor", imgValue);
    httpService
      .imgPost(API.LandscapePainting, formData)
      .then((res: any) => {
        if (res.data.code === 0) {
          const { data } = res.data;
          const img = new Image();
          img.src = data.image;
          img.crossOrigin = "Anonymous";

          img.onload = () => {
            constant.current!.imageIns!.ctx?.drawImage(img, 0, 0, WIDTH, WIDTH);
            constant.current!.imageIns!.drew = true;
          };
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const uploadFile = (e: { file: UploadFile }) => {
    const file = e.file.originFileObj as Blob;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      var img = new Image();
      img.src = reader.result as string;
      img.onload = function () {
        const [width, height] = getAdaptSize({
          img,
          containerW: WIDTH,
          containerH: WIDTH,
        });
        constant.current?.instance?.ctx.clearRect(0, 0, WIDTH, WIDTH);
        constant.current?.instance?.ctx?.drawImage(
          img,
          (WIDTH - width) / 2,
          (WIDTH - height) / 2,
          width,
          height
        );
      };
    };
  };

  const exportImg = () => {
    const imageIns = constant.current!.imageIns!;
    if (!imageIns!.drew) {
      message.error("请先生成预览图");
      return;
    }

    let link = document.createElement("a");

    link.href = imageIns.canvas.toDataURL("image/png");
    link.download = `draw-${new Date().getTime()}.png`;
    link.click();
  };

  return (
    <div className="layout">
      <Banner
        type="draw"
        demoMove={() => document.getElementById("demo")?.scrollIntoView()}
      />
      <div id="demo">
        <h2 className="common-module-tit">绘画转图片功能体验</h2>
        <main className={styles.main}>
          <div className={styles.left}>
            <div className={styles.tools}>
              <Upload
                onChange={uploadFile}
                showUploadList={false}
                beforeUpload={beforeUploadImg}
                accept=".jpg, .png, .jpeg, .bmp"
              >
                <Button type="primary" icon={<UploadOutlined />}>
                  上传图片
                </Button>
              </Upload>
              <Button
                type="default"
                onClick={() => constant.current?.instance?.clear()}
              >
                清空
              </Button>
              <Button type="default" onClick={() => exportImg()}>
                导出
              </Button>
              <Button type="default" onClick={() => changeType()}>
                {type === "pen" ? "橡皮擦" : "画笔"}
              </Button>
              <div className={styles.slider}>
                <Slider min={1} onChange={onChangeLineWidth} />
              </div>
            </div>
            <canvas
              id="myDrawCanvas"
              style={
                {
                  "--canvas-pointer": `url(/src/assets/images/open/${type}.png),default`,
                } as CSSProperties
              }
            />
          </div>
          <div className={styles.right}>
            <div className={styles.tools}>
              <Select
                options={options}
                value={imgStyle}
                onChange={(val) => setImgStyle(val)}
              />
              <div className={styles.slider}>
                <Slider min={1} onChange={(val) => setImgValue(val)} />
              </div>
              <Button onClick={drawPicture}>生成预览图</Button>
            </div>
            <div className={styles.img}>
              <canvas id="imgCanvas" />
            </div>
          </div>
        </main>
      </div>

      <ApplyList type="draw" />
      <Special type="draw" />
    </div>
  );
};

export default Draw;
