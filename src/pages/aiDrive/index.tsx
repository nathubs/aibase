import styles from "./index.module.less";
import driveA from "@/assets/images/home/zhitu_a.png";
import driveB from "@/assets/images/home/zhitu_b.png";
import driveC from "@/assets/images/home/zhitu_c.png";
import driveD from "@/assets/images/home/zhitu_d.png";
import star from "@/assets/images/home/star.png";

export default function AiDrive() {
  return (
    <>
      <div className={styles.info}>
        <img src={driveA} className={styles.desc} />
        <img src={driveB} className={styles.desc} />
        <img src={driveC} className={styles.desc} />
        <img src={driveD} className={styles.desc} />
        <div className={styles.tip}>
          <img src={star} className={styles.star} />
          不止于此，更多AI速搭升级中…
          <img src={star} />
        </div>
      </div>
    </>
  );
}
