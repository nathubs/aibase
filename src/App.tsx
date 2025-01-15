import { RouterProvider } from "react-router-dom";
import "./css/global.less";
import "./css/common.less";
import router from "./router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
