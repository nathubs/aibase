import "./demo.less";
import { Button } from "antd";
import { drawSquare, getImageUrlToBase64 } from "./draw-face";
import { imgFile } from "./default-img";
import { useState, useEffect } from "react";
import ReactJson from "react-json-view";
import httpService from "@/service/httpService";
import Banner from "../component/banner";
import ApplyList from "../component/applyList";
import Special from "../component/special";

export default function FaceCheck() {
  const [selectIndex, setSelectIndex] = useState<any>(1);
  const [faceJson, setFaceJson] = useState<any>({});
  let scale = 0.5859375;
  let scaleY = 0.5859375;
  let painScale = 1;
  let rectSize: any = [];

  const uploadFile = (e: any) => {
    setSelectIndex(null);
    const file = e.target.files[0] || e.dataTransfer.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      drawImg((reader as any).result, file);
    };
  };

  const customUpload = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("groupID", "demov6");
    formData.append("extra", "landmarks");
    httpService
      .imgPost("/v1/faceRecognition/detectFaces", formData)
      .then((res: any) => {
        if (res.data.code === 0) {
          setFaceJson(res.data);
          drawSquare(res.data.data.areas, rectSize, scale * painScale, scaleY);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const drawImg = (url: string, file: any) => {
    const canvas: any = document.getElementById("myCanvas");
    const ctx = (canvas as any).getContext("2d");

    const img = new Image(); //img 可以 new 也可以来源于我们页面的img标签
    img.src = url; // 设置图片源地址

    img.onload = function () {
      scale = canvas.width / img.width;
      scaleY = canvas.height / img.height;
      let imgHeight = canvas.height;
      imgHeight = scaleY * img.height;
      // 图片自适应高度缩放的宽高比
      let painWidth = (img.width / img.height) * imgHeight;
      painScale = painWidth / canvas.width;
      // 每次绘制先清除画布
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 画布中心位置坐标
      rectSize = [
        (canvas.width - painWidth) / 2,
        (canvas.height - imgHeight) / 2,
      ];
      // 绘制图片
      ctx.drawImage(img, rectSize[0], rectSize[1], painWidth, imgHeight);
    };
    // 如果是上传文件，需要走接口取数据
    if (file) {
      customUpload(file);
    }
  };
  const selectImg = (index: number) => {
    setSelectIndex(index);
    const url = imgFile[index].url;
    getImageUrlToBase64(url).then((res: any) => {
      drawImg(url, res.file);
    });
  };

  useEffect(() => {
    selectImg(0);
  }, []);

  return (
    <div className="layout">
      <Banner
        type="faceCheck"
        demoMove={() => {
          document.getElementById("demo")?.scrollIntoView();
        }}
      />
      <div className="feature-wrapper" id="demo">
        <h2>功能体验</h2>
        <div className="demo-wrapper">
          <div className="container" id="demo">
            <div className="left-wrapper">
              <div className="img-wrapper" v-loading="loading">
                <canvas
                  id="myCanvas"
                  width="788"
                  height="527"
                  className="canvas"
                ></canvas>
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
                  src={faceJson}
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
      <ApplyList type="faceCheck" />
      <Special type="faceCheck" />
    </div>
  );
}
