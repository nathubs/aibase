import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  children?: ReactNode;
}

export const BasicLayout = (props: Props) => {
  const { children } = props;
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
export const LayoutFull = () => {
  return (
    <BasicLayout>
      <Outlet />
    </BasicLayout>
  );
};
