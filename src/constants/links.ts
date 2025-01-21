/*
 * @Date: 2024-07-01 16:17:38
 * @LastEditors: bingkui.wu
 * @LastEditTime: 2024-07-25 15:56:34
 * @Description: 用到的外部链接
 */

import router from "@/router";
import { getPublicUrl } from "@/utils";
import { message } from "antd";

/** 用到的外部链接 */
export const LINKS = {
  /** 赛事 */
  ROBOG: "https://robog.ubtrobot.com/#/home",
  /** ICP备案 */
  ICP: "https://beian.miit.gov.cn/",
  /** 智慧平台 */
  SMART_PLATFORM: "https://aiedu.ubtrobot.com/web/",
  /** 开放生态 */
  OPEN_DOCS: "https://aiedu.ubtrobot.com/open/docs/",
};

export enum IFramePage {
  /** 使用条款 */
  TERM = "term",
  /** 隐私政策 */
  PRIVACYPOLICY = "privacy-policy",
}

/**
 * 定义可用的iframe地址
 */
const IFrameUrl: Record<IFramePage, string> = {
  [IFramePage.TERM]: getPublicUrl("static/term.html"),
  [IFramePage.PRIVACYPOLICY]: getPublicUrl("static/privacy-policy.html"),
} as const;

/**
 * 获取iframe的地址
 * @param page
 * @returns
 */
export const getIframeUrl = (page: IFramePage) => {
  let url = IFrameUrl[page];
  if (!url) {
    message.error("未找到iframe地址:" + page);
  }
  return url;
};

/**
 * 跳转到指定的iframe页面
 * @param page
 */
export const goToIframe = (page: IFramePage) => {
  router.navigate(`/home/frame/${page}`);
  window.scrollTo(0, 0);
};
