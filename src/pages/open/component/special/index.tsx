import { useMemo } from "react";
import { DESC_MAP } from "../util/config";
import styles from "./index.module.less";

export interface IItem {
  title: string;
  desc: string;
}
const Special = ({ type }: { type: string }) => {
  const list = useMemo(() => {
    const ret = DESC_MAP[type]?.specialAdvantages;
    if (!ret) {
      return [];
    }
    return ret.map((item: string) => {
      const arr = item.split("-");
      return {
        title: arr[0],
        desc: arr[1],
      };
    });
  }, [type]);
  return (
    <>
      <h2 className="common-module-tit">特色优势</h2>
      <div className={styles.special}>
        {list.map((item: IItem) => (
          <div className={styles.item} key={item.title}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.desc}>{item.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Special;
