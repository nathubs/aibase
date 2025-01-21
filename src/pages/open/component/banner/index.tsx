import bg from "@/assets/images/home/ai_pic_bg.png";
import styles from "./index.module.less";
import { Button } from "antd";
import { DESC_MAP } from "../util/config";

interface IProps {
  type: string;
  demoMove?: () => void;
}

const Banner = ({ type, demoMove }: IProps) => {
  return (
    <div
      className={styles.techBanner}
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className={styles.title}>{DESC_MAP[type]?.title}</div>
      <div className={styles.flex}>
        <div className={styles.desc}>{DESC_MAP[type]?.intro}</div>
        <div className={styles.btns}>
          {demoMove && (
            <Button className={styles.demo} onClick={demoMove}>
              Demo体验
            </Button>
          )}
          {DESC_MAP[type]?.docUrl && (
            <Button
              className={styles.document}
              onClick={() => window.open(DESC_MAP[type]?.docUrl)}
            >
              技术文档
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
