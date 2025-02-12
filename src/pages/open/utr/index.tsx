import { Button, Upload, UploadFile } from "antd";
import ApplyList from "../component/applyList";
import Banner from "../component/banner";
import Special from "../component/special";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import ReactJson from "react-json-view";
import { useState } from "react";
import httpService from "@/service/httpService";
import { API } from "@/service/api";
import { drawTextSquare } from "../faceCheck/draw-face";
import { beforeUploadImage } from "./util";
import { beforeUploadImg } from "../utils";

const UTR = () => {
  const [json, setJson] = useState({});
  const [textList, setTextList] = useState<string[]>([]);
  const onChange = async ({ file }: { file: UploadFile }) => {
    const result = await beforeUploadImage(file.originFileObj as Blob);

    const formData = new FormData();
    formData.append("image", file.originFileObj as Blob);
    httpService
      .imgPost(API.getOcrProcess, formData)
      .then((res: any) => {
        if (res.data.code === 0) {
          setJson(res.data);
          console.log(result, res.data);
          drawTextSquare(
            res.data.data.result,
            result.rectSize,
            result.scale,
            result.scale
          );
          const list = res.data.data.result.map((item: any) => item.text);
          setTextList(list);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <div className="layout">
      <Banner
        type="utr"
        demoMove={() => document.getElementById("demo")?.scrollIntoView()}
      />
      <div id="demo">
        <h2 className="common-module-tit">功能体验</h2>
        <main className={styles.demo}>
          <div className={styles.left}>
            <Upload
              onChange={onChange}
              showUploadList={false}
              beforeUpload={beforeUploadImg}
              accept=".jpg, .png, .jpeg, .bmp"
            >
              <Button type="primary" icon={<UploadOutlined />}>
                上传图片
              </Button>
            </Upload>
            <div className={styles.img}>
              <canvas id="myCanvas" width={758} height={500} />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.text}>
              <div className={styles.tit}>识别输出</div>
              {textList.map((str) => (
                <div>{str}</div>
              ))}
            </div>
            <div className={styles.json}>
              <ReactJson src={json} />
            </div>
          </div>
        </main>
      </div>
      <ApplyList type="utr" />
      <Special type="utr" />
    </div>
  );
};

export default UTR;
