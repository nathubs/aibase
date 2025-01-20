import { UploadOutlined } from "@ant-design/icons";
import ApplyList from "../component/applyList";
import Banner from "../component/banner";
import Special from "../component/special";
import styles from "./index.module.less";
import { Button, Select, Slider } from "antd";
import { useMount, useUnmount } from "ahooks";
import { CanvasDraw } from "./canvas-draw";
import { CSSProperties, useRef, useState } from "react";
import { base64ToFile } from "../faceCheck/draw-face";
import httpService from "@/service/httpService";
import { API } from "@/service/api";

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

const Draw = () => {
  const constant = useRef<{ instance?: CanvasDraw }>();
  const [type, setType] = useState("pen");
  const [imgStyle, setImgStyle] = useState("spring");
  const [imgValue, setImgValue] = useState(1);
  const [generatedImg, setGeneratedImg] = useState("");

  const onChangeLineWidth = (value: number) => {
    constant.current?.instance?.changeLineWidth(value);
    setImgValue(6);
  };

  useMount(() => {
    constant.current = {
      instance: new CanvasDraw(),
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

          setGeneratedImg(data.image);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
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
              <Button type="primary" icon={<UploadOutlined />}>
                本地上传
              </Button>
              <Button
                type="default"
                onClick={() => constant.current?.instance?.clear()}
              >
                清空
              </Button>
              <Button type="default">导出</Button>
              <Button type="default" onClick={() => changeType()}>
                {type === "pen" ? "橡皮擦" : "画笔"}
              </Button>
              <div className={styles.slider}>
                <Slider min={1} onChange={onChangeLineWidth} />
              </div>
            </div>
            <canvas
              id="myCanvas"
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
              <img src={generatedImg} />
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
