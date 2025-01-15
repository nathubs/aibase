import { jsx as _jsx } from "react/jsx-runtime";
import { Spin as AntdSpin } from 'antd';
import classNames from 'classnames';
import LoadingGif from './img/loading.gif';
import styles from './index.module.less';
export const Spin = (props) => {
    const { indicator: _indicator, width = 62, className, fixed, centered = true, absolute, ...remainingProps } = props;
    const indicator = _indicator ?? _jsx("img", { src: LoadingGif, style: { width, height: 'auto' }, alt: "" });
    return (_jsx("div", { className: classNames(className, {
            [styles.centered]: centered,
            [styles.fixed]: fixed,
            [styles.absolute]: absolute,
        }), children: _jsx(AntdSpin, { indicator: indicator, ...remainingProps }) }));
};
