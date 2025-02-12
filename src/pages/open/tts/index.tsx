import { Form, Input, Select, Slider, message } from "antd";
import ApplyList from "../component/applyList";
import Banner from "../component/banner";
import Special from "../component/special";
import styles from "./index.module.less";
import { DeleteOutlined } from "@ant-design/icons";
import play from "@/assets/images/open/play.png";
import download from "@/assets/images/open/play.png";
import httpService from "@/service/httpService";
import { API } from "@/service/api";
import { useState } from "react";

const defaultSpeakerList = [
  {
    value: 1,
    label: "成年女生",
  },
  {
    value: 2,
    label: "少年女生",
  },
  {
    value: 3,
    label: "成年男生",
  },
  {
    value: 4,
    label: "少年男生",
  },
];

const speedOpts = [
  { label: "x1", value: 1 },
  { label: "x2", value: 2 },
];

const initialValues = {
  text: "",
  speaker: 1,
  speed: 1,
  volume: 10,
  pitch: 0,
};

const TTS = () => {
  const [form] = Form.useForm();
  const [text, setText] = useState("");
  const [wavUrl, setWavUrl] = useState("");

  const handlePlay = async () => {
    if (!text?.trim()) {
      message.error("请输入文本");
      return;
    }
    const params = form.getFieldsValue();
    const dataForm = new FormData();
    dataForm.append("text", text);
    dataForm.append("speaker", params.speaker);
    dataForm.append("volume", params.volume);
    dataForm.append("speed", params.speed);
    dataForm.append("pitch", params.pitch);

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const res: any = await httpService.post(
      API.getTTsProcess,
      dataForm,
      null,
      headers
    );
    console.log(res);
    if (res?.data?.data?.audio) {
      const textAudio = document.createElement("audio");
      textAudio.src = res?.data?.data?.audio;
      setWavUrl(textAudio.src);
      console.log("data.audio===", textAudio.src);
      textAudio.play();
    }
  };

  const save = () => {
    if (!wavUrl) {
      message.error("请先播放音频");
    }
    fetch(wavUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `audio-${new Date().getTime()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // 释放 Object URL
      })
      .catch((error) => {
        console.error("Error downloading WAV file:", error);
      });
  };

  return (
    <div className="layout">
      <Banner type="tts" />
      <div id="demo" className={styles.demo}>
        <h2 className="common-module-tit">功能体验</h2>
        <main>
          <div className={styles.tools}>
            <Form layout="inline" initialValues={initialValues} form={form}>
              <Form.Item label="发音人：" name="speaker">
                <Select options={defaultSpeakerList} />
              </Form.Item>
              <Form.Item label="语速：" name="speed">
                <Select options={speedOpts} />
              </Form.Item>
              <Form.Item label="音量：" name="volume">
                <Slider
                  max={10}
                  marks={{
                    0: 0,
                    10: 10,
                  }}
                ></Slider>
              </Form.Item>
              <Form.Item label="音调：" name="pitch">
                <Slider
                  min={-20}
                  max={20}
                  marks={{
                    [-20]: -20,
                    20: 20,
                  }}
                ></Slider>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.input}>
            <Input.TextArea
              placeholder="请输入配音内容"
              className={styles.textarea}
              showCount
              maxLength={250}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <div className={styles.clear} onClick={() => setText("")}>
              <DeleteOutlined />
              清空文本
            </div>
          </div>
          <div className={styles.bot}>
            <div className={styles.play} onClick={handlePlay}>
              <img src={play} width={65} height={65} />
              点击按钮即可试听配音哦~
            </div>
            <div className={styles.download} onClick={save}>
              <img src={download} width={50} height={50} /> 保存音频
            </div>
          </div>
        </main>
      </div>
      <ApplyList type="tts" />
      <Special type="tts" />
    </div>
  );
};

export default TTS;
