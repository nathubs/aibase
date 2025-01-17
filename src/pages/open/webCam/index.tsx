import styles from "./index.module.less";
import { Button, Tabs } from "antd";
import "./demo.less";
import { imgFile } from "./defaultImg";
import { useState, useEffect, useRef } from "react";
import ReactJson from "react-json-view";
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { LeftVideo } from "./left-video";
import { ShowJson } from "./left-video/VideoGesture";
import { getImageUrlToBase64 } from "../faceCheck/draw-face";
import Banner from "../component/banner";
import ApplyList from "../component/applyList";
import Special from "../component/special";
let gestureRecognizer: any;

export default function WebCam() {
  const [selectIndex, setSelectIndex] = useState<any>(1);
  const [currentImg, setCurrentImg] = useState<any>();
  const [data, setData] = useState<ShowJson>({});
  const currentImgRef = useRef(null);
  const [type, setType] = useState("image");

  const changeType = (type: string) => {
    setType(type);
    setData({});
  };

  const uploadFile = (e: any) => {
    setSelectIndex(null);
    const file = e.target.files[0] || e.dataTransfer.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      drawImg((reader as any).result, file);
    };
  };

  /** 图片点击 */
  const handleClick = async (event: any) => {
    // Remove all previous landmarks
    const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
    for (var i = allCanvas.length - 1; i >= 0; i--) {
      const n = allCanvas[i];
      n.parentNode.removeChild(n);
    }
    if (!gestureRecognizer) {
      console.log("Please wait for gestureRecognizer to load");
      return;
    }

    // await gestureRecognizer.setOptions({ runningMode: "IMAGE" })
    const results = gestureRecognizer.recognize(event.target);

    // View results in the console to see their format
    if (results.gestures.length > 0) {
      if (results.gestures[0][0].categoryName === "left") {
        if (results.landmarks[0][0].x > results.landmarks[0][8].x) {
          results.gestures[0][0].categoryName = "left";
        } else {
          results.gestures[0][0].categoryName = "right";
        }
      }
      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore: any = parseFloat(
        (results.gestures[0][0].score * 100) as any
      ).toFixed(2);
      const handedness = results.handednesses[0][0].displayName;

      setData({
        gestureRecognizer: categoryName,
        confidence: categoryScore + "%",
        handedness: handedness,
      });
      const canvas = document.createElement("canvas");
      const { naturalWidth, naturalHeight, width, height } = event.target;
      canvas.setAttribute("class", "canvas");
      canvas.setAttribute("width", naturalWidth + "px");
      canvas.setAttribute("height", naturalHeight + "px");
      const scalHeight = (width / naturalWidth) * naturalHeight;
      const scalWidth = (height / naturalHeight) * naturalWidth;
      if (scalWidth > width) {
        // 缩放后太宽了，高度不变，宽度做缩放
        (
          canvas as any
        ).style = `position:absolute;left: 0;top: 50%;transform: translateY(-50%);width:${width}px;height:${scalHeight}px;`;
      } else {
        (
          canvas as any
        ).style = `position:absolute;left: 50%;top: 0;transform: translateX(-50%);width:${scalWidth}px;height:${height}px;`;
      }

      event.target.parentNode.appendChild(canvas);
      const canvasCtx: any = canvas.getContext("2d");
      const drawingUtils: any = new DrawingUtils(canvasCtx);
      for (const landmarks of results.landmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          GestureRecognizer.HAND_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 5,
          }
        );
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF0000",
          lineWidth: 1,
          radius: 4,
        });
      }
    }
  };

  const drawImg = (url: string, file: any) => {
    setCurrentImg(url);
    setTimeout(() => {
      if (currentImgRef && currentImgRef.current) {
        (currentImgRef?.current as any).click();
      }
    }, 10);
  };
  const selectImg = (index: number) => {
    setSelectIndex(index);
    const url = imgFile[index].url;
    getImageUrlToBase64(url).then((res: any) => {
      drawImg(url, res.file);
    });
  };

  const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      `https://edustorge.ubtrobot.com/edu-lib/test/mediapipe/tasks-vision/wasm`
      // "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://test178.nangua203.com/important-files/gesture_recognizer.task`,
        // "https://aiclassroom.ubtrobot.com/aiengine/resources/gesture_recognizer.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
    });
    selectImg(0);
  };

  useEffect(() => {
    createGestureRecognizer();
  }, []);

  return (
    <div className="layout">
      <Banner
        type="webCam"
        demoMove={() => {
          document.getElementById("demo")?.scrollIntoView();
        }}
      />
      <div className="feature-wrapper" id="demo">
        <h2>功能体验</h2>
        <div className="demo-wrapper">
          <Tabs
            activeKey={type}
            items={[
              { key: "image", label: "图片识别" },
              { key: "video", label: "视频识别" },
            ]}
            onChange={(key) => changeType(key)}
          />
          <div className="container" id="demo">
            <LeftVideo
              setJSON={setData}
              style={{ display: type === "video" ? "block" : "none" }}
            />
            <div
              className="left-wrapper"
              style={{ display: type === "video" ? "none" : "block" }}
            >
              <div className="img-wrapper">
                <img
                  src={currentImg}
                  ref={currentImgRef}
                  alt=""
                  onClick={handleClick}
                />
                {/* <canvas id="myCanvas" width="788" height="527" className="canvas"></canvas> */}
              </div>
              <div className="upload-wapper">
                <div className="desc">
                  <p>图片文件类型支持PNG、JPG、JPEG、BMP，图片大小不超过 10M</p>
                  <p>
                    建议使用清晰的、算式规整、文字与空白占比较大的照片，效果更好{" "}
                  </p>
                </div>
                <Button type="primary" className="upload">
                  本地上传
                  <input
                    type="file"
                    onChange={uploadFile}
                    accept=".jpg,png,.jpeg,.bmp"
                  />
                </Button>
              </div>
              <div className="imgs-wrapper">
                {imgFile.map((item: any, index: number) => {
                  return (
                    <div
                      className={`img-box ${
                        selectIndex === index ? "active" : ""
                      }`}
                      key={item.url}
                      onClick={() => {
                        selectImg(index);
                      }}
                    >
                      <img src={item.url} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="right-wrapper">
              <h3>JSON</h3>
              <div className="json-wrapper">
                <ReactJson
                  src={data}
                  style={{
                    width: "330px",
                    height: "630px",
                    overflow: "scroll",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ApplyList type="webCam" />
      <Special type="webCam" />
    </div>
  );
}
