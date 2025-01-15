import { jsx as _jsx } from "react/jsx-runtime";
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale/zh_CN';
const prefixCls = 'open';
const iconPrefixCls = 'open';
ConfigProvider.config({
    prefixCls,
    iconPrefixCls,
    theme: {
        primaryColor: '#6d73ff',
        infoColor: '#6d73ff',
        successColor: '#67D144',
        errorColor: '#FF528B',
        warningColor: '#FFBC19',
    },
});
/** 公共上下文 */
export const BasicProvider = ({ children, getPopupContainer, }) => {
    return (_jsx(ConfigProvider, { locale: zh_CN, prefixCls: prefixCls, iconPrefixCls: iconPrefixCls, getPopupContainer: getPopupContainer, children: children }));
};
