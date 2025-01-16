import { Navigate, createHashRouter } from "react-router-dom";
import Home from "../pages/home";
import { LayoutFull } from "../layout";
import FaceCheck from "@/pages/open/faceCheck";
import WebCam from "@/pages/open/webCam";
import Chat from "@/pages/chat";

export const routes = [
  {
    element: <LayoutFull />,
    children: [
      {
        name: "Home",
        path: "/home",
        element: <Home />,
      },
      {
        name: "faceCheck",
        path: "/open/faceCheck",
        element: <FaceCheck />,
      },
      {
        name: "webCam",
        path: "/open/webCam",
        element: <WebCam />,
      },
      {
        name: "chat",
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" />, 
  },
];

export default createHashRouter(routes);
