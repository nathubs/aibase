import { useState, useEffect, FC } from "react";
import styles from "./index.module.less";
import logoImg from "@/assets/images/home/logo.png";
import { menuData } from "./config";
import router from "@/router";
import { useLocation } from "react-router-dom";

// 过滤掉无需change headNavBar背景色的route
const headNavBgFixRoutes = ["/contact/consult"];
// 过滤掉无需回到页面顶部的route
const filterScrollToTopRoutes = [
  "/solution/learn/smartlearn/digital",
  "/solution/learn/smartlearn/pen",
  "/solution/family/smarthome/sweepmachine",
  "/solution/nurse/smartaccompany/monitor",
];

const HeaderLayout: FC = () => {
  //通过flag 来控制进度条的显示隐藏
  const [pageScrollNum, setPageScrollNum] = useState<number>(0);
  const { pathname } = useLocation();

  const [curMenu, setCurMenu] = useState<any>(menuData[0]);

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
    if (filterScrollToTopRoutes.includes(pathname)) {
      return;
    }
    /* 监听路由的变化 */
    router.subscribe((current) => {
      /*页面回到顶部 */
      if (
        !filterScrollToTopRoutes.includes(current.location.pathname) &&
        (document.body.scrollTop || document.documentElement.scrollTop > 0)
      ) {
        // 此处的location.pathname 的pathname还是会监听到history，无法获取current，所以无法拦截
        window.scrollTo(0, 0);
      }
    });
  }, [pathname]);

  return (
    <div
      className={
        !headNavBgFixRoutes.includes(location.pathname)
          ? pageScrollNum > 80
            ? `${styles.head_nav_wrap} ${styles.active} header_active`
            : `${styles.head_nav_wrap}`
          : `${styles.head_nav_wrap} head_static_bg`
      }
    >
      <div className={styles.home_header}>
        <div className={styles.logo_img}>
          <img src={logoImg} alt="" onClick={toHome} />
        </div>
        <ul className={styles.menu}>
          <li onClick={toHome}>首页</li>
          <li className={styles.openTechMenu}>
            开放能力
            <div className={styles.openTech}>
              <div className={styles.left}>
                <div className={styles.tit1}>
                  技术能力<span className={styles.arrow}>&gt;</span>
                </div>
                {menuData.map((item: any, index: number) => {
                  return (
                    <div
                      className={styles.tit1}
                      key={item.name}
                      onMouseMove={() => {
                        setCurMenu(menuData[index]);
                      }}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
              <div className={styles.right}>
                {curMenu.category.map((cate: any) => {
                  return (
                    <div className={styles.item} key={cate.name}>
                      <div className={styles.itemTit}>
                        {cate.name}
                        <span className={styles.arrow}>&gt;</span>
                      </div>
                      {cate.category.map((thirdCate: any) => {
                        return (
                          <div
                            className={styles.third}
                            key={thirdCate.name}
                            onClick={() => {
                              router.navigate(thirdCate.path);
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
            onClick={() => {
              // history.push('/aiDrive');
            }}
          >
            AI智途
          </li>
          <li>软硬一体</li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderLayout;
