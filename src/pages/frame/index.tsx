import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIframeUrl, IFramePage } from "@/constants/links";

import "./index.scss";
import { Spin } from "antd";

const IframeLoader = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { name } = useParams();
  const [loading, setLoading] = useState(true);

  const resetHeight = (event: { data: { height: number; action: string } }) => {
    if (!iframeRef.current) {
      return;
    }
    if (event.data?.action === "getPageHeight") {
      console.log("receive iframe message:", event.data);
      const height = event.data.height;
      iframeRef.current.style.height = `${height}px`;
      window.scrollTo(0, 0);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    setLoading(true);
    iframeRef.current.style.height = `${0}px`;

    const iframe: HTMLIFrameElement = iframeRef.current;
    iframe.src = getIframeUrl(name as IFramePage);

    // 监听iframe页面的postMessage消息
    window.addEventListener("message", resetHeight, false);

    return () => {
      window.removeEventListener("message", resetHeight);
    };
  }, [name]);

  return (
    <div className="iframe-container">
      {loading && <Spin />}
      <iframe
        key={name}
        className="landing-iframe"
        ref={iframeRef}
        scrolling="no"
        frameBorder="0"
      />
    </div>
  );
};

export default IframeLoader;
