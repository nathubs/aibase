import { useState, useEffect, FC, useMemo } from "react";
import styles from "./index.module.less";
import logoImg from "@/assets/images/home/logo.png";
import { menuData } from "./config";
import router from "@/router";
import { useLocation } from "react-router-dom";
import classNames from "classnames";

const HeaderLayout: FC = () => {
  const [pageScrollNum, setPageScrollNum] = useState<number>(0);
  const { pathname } = useLocation();

  const [firstIndex, setFirstIndex] = useState(0);

  const activeIndex = useMemo(() => {
    const matches = pathname.split("/").filter((item) => item);
    return ["home", "open", "aiDrive"].findIndex((item) => item === matches[0]);
  }, [pathname]);

  const isOpen = activeIndex === 1;

  const activeOpenName = useMemo(() => {
    if (!isOpen) {
      return "";
    }
    const matches = pathname.split("/").filter((item) => item);
    const ret = matches?.[matches.length - 1];
    const curIndex = menuData.findIndex((item) =>
      item.category.some((v: any) => {
        if (v.type === ret) {
          return true;
        }
        return v.category.some(
          (n: any) => n.type === ret || n.path?.includes(ret)
        );
      })
    );
    console.log(curIndex, "xxx");
    if (curIndex !== firstIndex) {
      setFirstIndex(curIndex);
    }

    return ret;
  }, [pathname, activeIndex]);

  const handleScroll = () => {
    setPageScrollNum(window.pageYOffset);
  };
  const toHome = () => {
    if (pathname !== "/home") {
      router.navigate("/home");
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    /* 监听路由的变化 */
    router.subscribe(() => {
      /*页面回到顶部 */
      if (document.body.scrollTop || document.documentElement.scrollTop > 0) {
        // 此处的location.pathname 的pathname还是会监听到history，无法获取current，所以无法拦截
        window.scrollTo(0, 0);
      }
    });
  }, [pathname]);

  return (
    <div
      className={
        pageScrollNum > 80
          ? `${styles.head_nav_wrap} ${styles.active} header_active`
          : `${styles.head_nav_wrap}`
      }
    >
      <div className={styles.home_header}>
        <div className={styles.logo_img}>
          <img src={logoImg} alt="" onClick={toHome} />
        </div>
        <ul className={styles.menu}>
          <li
            className={classNames({ active: activeIndex === 0 })}
            onClick={toHome}
          >
            首页
          </li>
          <li
            className={classNames(styles.openTechMenu, {
              active: activeIndex === 1,
            })}
          >
            开放能力
            <div className={styles.openTech}>
              <div className={styles.left}>
                {menuData.map((item: any, index: number) => {
                  return (
                    <div
                      className={classNames(styles.tit1, {
                        active: index === firstIndex && isOpen,
                      })}
                      key={item.name}
                      onMouseMove={() => {
                        setFirstIndex(index);
                      }}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
              <div className={styles.right}>
                {menuData[firstIndex]?.category.map((cate: any) => {
                  return (
                    <div
                      className={styles.item}
                      key={cate.name}
                      onClick={() => {
                        if (cate.category.length === 0 && cate.type) {
                          router.navigate(
                            cate.path ?? `/open/intro/${cate.type}`
                          );
                        }
                      }}
                    >
                      <div className={styles.itemTit}>
                        {cate.name}
                        {cate.category.length === 0 && (
                          <span className={styles.arrow}>&gt;</span>
                        )}
                      </div>
                      {cate.category.map((thirdCate: any) => {
                        return (
                          <div
                            className={classNames(styles.third, {
                              active:
                                activeOpenName === thirdCate.type ||
                                (thirdCate.path?.includes(activeOpenName) &&
                                  isOpen),
                            })}
                            key={thirdCate.name}
                            onClick={() => {
                              router.navigate(
                                thirdCate.path ??
                                  `/open/intro/${thirdCate.type}`
                              );
                            }}
                          >
                            {thirdCate.name}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </li>
          <li
            className={classNames({ active: activeIndex === 2 })}
            onClick={() => {
              router.navigate("/aiDrive");
            }}
          >
            AI智途
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderLayout;
