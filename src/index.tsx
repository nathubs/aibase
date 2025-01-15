import { createHashRouter } from "react-router-dom";
import Home from "./pages/home";
import { LayoutFull } from "./layout";
import FaceCheck from "@/pages/open/faceCheck";

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
        name: "Open",
        path: "/open/faceCheck",
        element: <FaceCheck />,
      },
    ],
  },
];

export default createHashRouter(routes);
