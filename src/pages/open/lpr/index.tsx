import styles from "./index.module.less";
import "./demo.less";
import { App, Button } from "antd";
import { imgFile } from "./defaultCarImg";
import { useState, useEffect } from "react";
import ReactJson from "react-json-view";
import httpService from "@/service/httpService";
import { drawLpr, getImageUrlToBase64 } from "../faceCheck/draw-face";
import Banner from "../component/banner";
import ApplyList from "../component/applyList";
import Special from "../component/special";

export default function Lpr() {
  const [selectIndex, setSelectIndex] = useState<any>(1);
  const [imgType, setImgType] = useState<string>("wide");
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
    formData.append("file", file);
    formData.append("bCut", true as any);
    httpService
      .imgPost("/v1/lpr/rec", formData)
      .then((res: any) => {
        if (res.data.code === 0) {
          setFaceJson(res.data);
          drawLpr(
            res.data.data.plate_list,
            rectSize,
            imgType === "wide" ? scaleY * painScale : scale * painScale
          );
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const drawImg = (url: string, file: File) => {
    var canvas = document.getElementById("myCanvas");
    var ctx = (canvas as any).getContext("2d");

    var img = new Image(); //img 可以 new 也可以来源于我们页面的img标签
    img.src = url; // 设置图片源地址

    img.onload = function (res) {
      let imgWigth = (canvas as any).width;
      let imgHeight = (canvas as any).height;
      // 画布缩放的比例
      scale = (canvas as any).width / img.width;
      scaleY = (canvas as any).height / img.height;
      // 得到现在的图宽高
      imgWigth = scale * img.width;
      imgHeight = scaleY * img.height;
      // 每次绘制先清除画布
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, (canvas as any).width, (canvas as any).height);
      // 图片自适应高度缩放的宽高比
      if (img.width > img.height) {
        // 宽>高 横图，应设宽长为canvas宽度，高度适应
        setImgType("wide");
        let painHeight = (imgWigth * img.height) / img.width;
        // 图片自适应高度缩放的宽高比

        painScale = painHeight / (canvas as any).height;
        // 画布中心位置坐标
        rectSize = [
          ((canvas as any).width - imgWigth) / 2,
          ((canvas as any).height - painHeight) / 2,
        ];
        ctx.drawImage(img, rectSize[0], rectSize[1], imgWigth, painHeight);
      } else {
        // 宽>高 长图，应设高度为canvas高度，宽长适应
        setImgType("long");
        let painWidth = (img.width / img.height) * imgHeight;
        painScale = painWidth / (canvas as any).width;
        // 绘制图片
        // 画布中心位置坐标
        rectSize = [
          ((canvas as any).width - painWidth) / 2,
          ((canvas as any).height - imgHeight) / 2,
        ];
        ctx.drawImage(img, rectSize[0], rectSize[1], painWidth, imgHeight);
      }
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
        type="lpr"
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
              <div className="license-plate-wrapper">
                <h3>车牌信息</h3>
                <div className="license-plate-box" v-if="faceJson.data">
                  {faceJson?.data?.plate_list.map(
                    (item: any, index: number) => {
                      return (
                        <div className="car-item">
                          <div className="title">
                            <i></i>
                            车辆{index + 1}
                          </div>
                          <p>
                            车牌号码：
                            <span>{item.code}</span>
                          </p>
                          <div className="plate-img">
                            <p>
                              车牌矫正：
                              <img src={item.plate} />
                            </p>
                          </div>
                          <div className="plate-img cut-box">
                            <p>
                              车牌切割：
                              {item.cuts.map((cut: any) => {
                                return <img src={cut} />;
                              })}
                            </p>
                          </div>
                          <p>
                            车牌类型：
                            <span>{item.plate_name}</span>
                          </p>
                          <p>
                            置信度：
                            <span>{item.confidence}</span>
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <h3>JSON</h3>
              <div className="json-wrapper">
                <ReactJson
                  src={faceJson}
                  style={{
                    width: "330px",
                    height: "380px",
                    overflow: "scroll",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ApplyList type="lpr" />
      <Special type="lpr" />
    </div>
  );
}
