import {
  DrawingUtils,
  FilesetResolver,
  GestureRecognizer,
} from "@mediapipe/tasks-vision";

const videoHeight = "523px";
const videoWidth = "700px";

export class VideoGesture {
  videoGestureRecognizer: any;
  videoId?: string;
  videoDevicesList?: MediaDeviceInfo[];
  videoDom: any;
  lastVideoTime = 0;
  setJSON: React.Dispatch<ShowJson>;
  constructor(videoDom: HTMLVideoElement, setJSON: React.Dispatch<ShowJson>) {
    this.videoDom = videoDom;
    this.setJSON = setJSON;
  }

  async init() {
    if (!this.videoGestureRecognizer) {
      const vision = await FilesetResolver.forVisionTasks(
        `https://edustorge.ubtrobot.com/edu-lib/test/mediapipe/tasks-vision/wasm`
      );
      this.videoGestureRecognizer = await GestureRecognizer.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: `https://test178.nangua203.com/important-files/gesture_recognizer.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        }
      );
      console.log(this._hasGetUserMedia, "this._hasGetUserMedia");
      await this.checkMedia();
      await this.getVideoList();
    }
  }

  async getVideoList() {
    const devicesList = await navigator.mediaDevices.enumerateDevices();
    this.videoDevicesList = devicesList.filter(
      (item) => item.kind === "videoinput" && item.deviceId
    );
    if (this.videoDevicesList.length) {
      this.videoId = this.videoDevicesList[0].deviceId;
    }
  }

  get _hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  async checkMedia(): Promise<boolean> {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("已点击允许,开启成功");
      return true;
    } catch (error) {
      console.error("错误：", error);
      // alert('请前往授权打开摄像头，否则将无法使用该功能！');
      throw new Error("请前往授权打开摄像头，否则将无法使用该功能！");
    }
  }

  async enableCam() {
    if (!(await this.checkMedia())) {
      return false;
    }
    if (!this.videoGestureRecognizer) {
      console.log("Please wait for gestureRecognizer to load");
      return false;
    }
    // webcamRunning.value = true;
    const constraints = {
      video: {
        deviceId: this.videoId,
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (stream) {
      if (window.stream) {
        //先关闭之前已经打开的设备
        window.stream.getTracks().forEach((track) => {
          track.stop();
          this.videoDom.srcObject = null;
          window.stream = null;
        });
      }
      try {
        window.stream = stream;
        this.videoDom.srcObject = stream;
        this.videoDom.addEventListener(
          "loadeddata",
          this.predictWebcam.bind(this)
        );
      } catch (error) {
        this.videoDom.src = window.URL.createObjectURL(
          stream as unknown as any
        ); //老的播放方式
      }
      this.videoDom.onloadedmetadata = () => {
        this.videoDom?.play();
      };
      return true;
    } else {
      return false;
    }
  }

  async predictWebcam() {
    const video = this.videoDom;
    const canvasElement = document.getElementById(
      "output_canvas"
    )! as HTMLCanvasElement;
    const canvasCtx = canvasElement.getContext("2d")!;
    const webcamElement = document.getElementById("webcam")!;
    let nowInMs = Date.now();
    let results: any;
    if (video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = video.currentTime;
      results = await this.videoGestureRecognizer.recognizeForVideo(
        video,
        nowInMs
      );
    }

    if (!results) {
      return;
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);

    canvasElement.style.height = videoHeight;
    webcamElement.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    webcamElement.style.width = videoWidth;

    if (results?.landmarks) {
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
          lineWidth: 2,
        });
      }
    }
    canvasCtx.restore();
    if (results.gestures.length > 0) {
      if (results.gestures[0][0].categoryName === "left") {
        if (results.landmarks[0][0].x > results.landmarks[0][8].x) {
          results.gestures[0][0].categoryName = "right";
        } else {
          results.gestures[0][0].categoryName = "left";
        }
      }

      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore =
        Math.floor(results.gestures[0][0].score * 100) / 100;

      let handedness = results.handednesses[0][0].displayName;
      if (handedness === "Right") {
        handedness = "Left";
      } else {
        handedness = "Right";
      }
      const json = {
        gestureRecognizer: categoryScore > 80 ? categoryName : null,
        confidence: categoryScore > 80 ? categoryScore + "%" : null,
        handedness: handedness,
      };
      this.setJSON(json);
    }
    window.requestAnimationFrame(this.predictWebcam.bind(this));
  }
}

export interface ShowJson {
  gestureRecognizer?: string | null;
  confidence?: string | null;
  handedness?: string | null;
}
