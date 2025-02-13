import { RouterProvider } from "react-router-dom";
import "./css/global.less";
import "./css/common.less";
import router from "./router";
import { message } from "antd";

message.config({
  top: 100,
  duration: 2,
});

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
