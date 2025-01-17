import { useMemo, useState } from "react";
import styles from "./index.module.less";
import { DESC_MAP } from "../util/config";
import classNames from "classnames";

const ApplyList = ({ type }: { type: string }) => {
  const [applyIndex, setApplyIndex] = useState(0);
  const list = useMemo(() => {
    const ret = DESC_MAP[type]?.applyList;
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
      <h2 className="common-module-tit">应用场景</h2>
      <div className={styles.apply}>
        <div className={styles.tabs}>
          {list.map((item: any, index: number) => (
            <div
              key={index}
              className={classNames({ [styles.active]: index === applyIndex })}
              onClick={() => setApplyIndex(index)}
            >
              {item.title}
            </div>
          ))}
        </div>
        <div className={styles.box}>
          <div className={styles.tit}>{list[applyIndex].title}</div>
          <div className={styles.desc}>{list[applyIndex].desc}</div>
        </div>
      </div>
    </>
  );
};

export default ApplyList;
