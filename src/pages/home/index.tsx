import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";
import banner from "@/assets/images/home/banner@2x.png";
import bannerText from "@/assets/images/home/banner_text.png";
import bannerTick from "@/assets/images/home/banner_tick.png";
import aitech_more from "@/assets/images/home/aitechnology_more_icon.png";
import aipaas from "@/assets/images/home/aipaas_watermark_pic_a.png";
import { getApps } from "@/service/llmService";
import { useEffect, useState } from "react";
import router from "@/router";

const techList = [
  { title: "人脸和人体技术", url: "/open/faceCheck" },
  { title: "图像检测", url: "/open/object" },
  { title: "语音技术", url: "/open/intro/audioTrans" },
  { title: "自然语音处理", url: "/open/intro/shortSpeech" },
];

export default function IndexPage() {
  const navigate = useNavigate();

  /** 大模型应用列表 */
  const [llmApps, setLlmApps] = useState<ChatAPP[]>([]);

  /** 打开大模型应用 */
  const onOpenChatApp = (app: ChatAPP) => {
    navigate(`/chat?id=${app.id}&name=${app.name}&mode=${app.mode}`);
  };

  useEffect(() => {
    getApps().then((res) => {
      // 可用的app
      const usedApps = res.data.filter((app) => app.icon_url);
      setLlmApps(usedApps);
    });
  }, []);

  return (
    <div className={styles.home_wrap}>
      <div className={styles.banner_cont}>
        <div className="container_cont banner_cont">
          <img src={bannerText} className="bannerText" />
          <img src={banner} className="bannerIndex" />
          <div className={styles.bannerInfo}>
            <div className={styles.item}>
              <div className={styles.title}>
                <img src={bannerTick} />
                智能模型融合
              </div>
              <p>打造定制化解决方案</p>
              <p>优化业务流程与决策</p>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>
                <img src={bannerTick} />
                动态工作流编排
              </div>
              <p>灵活应对多变业务需求</p>
              <p>实现高效智能体部署</p>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>
                <img src={bannerTick} />
                多角色协作平台
              </div>
              <p>激发团队创新潜力</p>
              <p>加速数字化转型</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.sec_cont} ${styles.bg_gray}`}>
        <div className="container_cont">
          <h1 className={styles.sec_til}>
            <i />
            热门应用
          </h1>
          <div className={styles.apply_cont}>
            {llmApps.map((app) => (
              <div
                className={`${styles.apply}`}
                key={app.id}
                onClick={() => onOpenChatApp(app)}
              >
                <img src={app.icon_url} className={styles.icon} />
                <div className={styles.item_cont_box}>
                  <div className={styles.title}>{app.name}</div>
                  <div className={styles.desc}>{app.description}</div>
                </div>
                <div className={styles.bottom}>
                  <i />
                  行知官方
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`${styles.ai_tech}`}>
        <img src={aipaas} className={styles.aipaas} />
        <div className="container_cont">
          <h1 className={styles.sec_til}>
            <i />
            AI技术
          </h1>
          <div className={styles.tech_cont}>
            {techList.map((item) => (
              <div
                className={styles.tech}
                onClick={() => router.navigate(item.url)}
              >
                <div className={styles.tit}>{item.title}</div>
                <div className={styles.more}>
                  更多
                  <img src={aitech_more} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
