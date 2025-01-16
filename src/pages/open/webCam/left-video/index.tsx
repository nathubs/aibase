import { useMount, useUpdateEffect } from "ahooks";
import { useMemo, useRef, useState } from "react";
import { ShowJson, VideoGesture } from "./VideoGesture";
import { Button, Select } from "antd";
import { Spin } from "@/components/basic";
import styles from "./index.module.less";
import classNames from "classnames";

export const LeftVideo = ({
  setJSON,
  style,
}: {
  setJSON: React.Dispatch<ShowJson>;
  style: React.CSSProperties;
}) => {
  const [videoDevicesList, setVideoDevicesList] = useState<MediaDeviceInfo[]>(
    []
  );
  const [videoId, setVideoId] = useState("");
  const constant = useRef<{ instance: VideoGesture }>();
  const [step, setStep] = useState("loading");

  useMount(async () => {
    const videoDom = document.getElementById("webcam") as HTMLVideoElement;
    const videoGestureInstance = new VideoGesture(videoDom, setJSON);
    await videoGestureInstance.init();
    constant.current = {
      instance: videoGestureInstance,
    };
    const devicesList = videoGestureInstance.videoDevicesList;
    if (devicesList?.length) {
      setVideoDevicesList(devicesList);
      setStep("canRun");
      setVideoId(devicesList[0].deviceId);
    }
  });

  const changeCamera = () => (val: string) => {
    setVideoId(val);
    constant.current!.instance.videoId = val;
  };

  const openCamera = async () => {
    if (!(await constant.current!.instance.checkMedia())) {
      return;
    }
    setStep("loading");
    const result = await constant.current!.instance.enableCam();
    if (result) {
      setStep("running");
    }
  };

  return (
    <div className="left-wrapper" style={style}>
      <div className={classNames("img-wrapper", styles.videoWrapper)}>
        <Spin
          size="large"
          className={styles.loading}
          style={{ display: step === "loading" ? "block" : "none" }}
        />
        <h2
          style={{ display: step === "canRun" ? "block" : "none" }}
          className={styles.tips}
        >
          请点击下方按钮打开摄像头
        </h2>

        <div
          className={styles.video}
          style={{ display: step === "running" ? "block" : "none" }}
        >
          <video id="webcam" autoPlay playsInline></video>
          <canvas
            className="output_canvas"
            id="output_canvas"
            width="1280"
            height="720"
            style={{ left: 0, top: 0, transform: "rotateY(-180deg)" }}
          ></canvas>
        </div>

        <div style={{ position: "relative" }}></div>
      </div>
      <div className="upload-wapper">
        <div className="desc">
          <p>请同意授权访问摄像头，并在摄像头前进行手势识别</p>
        </div>
      </div>
      <div className="upload-wapper">
        <Select
          className="select-video"
          placeholder="请选择摄像头"
          onChange={changeCamera()}
          value={videoId}
        >
          {videoDevicesList.map((v) => (
            <Select.Option key={v.deviceId} value={v.deviceId}>
              {v.label}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={() => openCamera()}
          disabled={videoDevicesList.length === 0}
        >
          打开/切换摄像头
        </Button>
      </div>
    </div>
  );
};
