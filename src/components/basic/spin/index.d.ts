import { SpinProps as AntdSpinProps } from 'antd';
export interface SpinProps extends AntdSpinProps {
    /** loading的图片宽度 */
    width?: string | number;
    /** 是否相对父容器垂直水平居中显示loading(默认true) */
    centered?: boolean;
    /** 是否全屏水平垂直居中loading */
    fixed?: boolean;
    /** 绝对定位水平垂直居中 */
    absolute?: boolean;
}
export declare const Spin: (props: SpinProps) => import("react/jsx-runtime").JSX.Element;
