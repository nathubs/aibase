import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
export const BasicLayout = (props) => {
    const { children } = props;
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), children, _jsx(Footer, {})] }));
};
export const LayoutFull = () => {
    return (_jsx(BasicLayout, { children: _jsx(Outlet, {}) }));
};
