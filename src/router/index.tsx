import { Navigate, createHashRouter } from "react-router-dom";
import { LayoutFull } from "../layout";
import { lazyLoad } from "./lazy-load";
import { lazy } from "react";

export const routes = [
  {
    element: <LayoutFull />,
    children: [
      {
        name: "Home",
        path: "/home",
        element: lazyLoad(lazy(() => import("../pages/home"))),
      },
      {
        name: "faceCheck",
        path: "/open/faceCheck",
        element: lazyLoad(lazy(() => import("../pages/open/faceCheck"))),
      },
      {
        name: "webCam",
        path: "/open/webCam",
        element: lazyLoad(lazy(() => import("../pages/open/webCam"))),
      },
      {
        name: "draw",
        path: "/open/draw",
        element: lazyLoad(lazy(() => import("../pages/open/draw"))),
      },
      {
        name: "lpr",
        path: "/open/lpr",
        element: lazyLoad(lazy(() => import("../pages/open/lpr"))),
      },
      {
        name: "object",
        path: "/open/object",
        element: lazyLoad(lazy(() => import("../pages/open/object"))),
      },
      {
        name: "intro",
        path: "/open/intro/:type",
        element: lazyLoad(lazy(() => import("../pages/open/intro"))),
      },
      {
        name: "utr",
        path: "/open/utr",
        element: lazyLoad(lazy(() => import("../pages/open/utr"))),
      },
      {
        name: "tts",
        path: "/open/tts",
        element: lazyLoad(lazy(() => import("../pages/open/tts"))),
      },
      {
        name: "chat",
        path: "/chat",
        element: lazyLoad(lazy(() => import("../pages/chat"))),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/home" />,
  },
];

export default createHashRouter(routes);
