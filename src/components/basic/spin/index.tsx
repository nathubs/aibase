import { Spin as AntdSpin, SpinProps as AntdSpinProps } from 'antd';
import classNames from 'classnames';

import LoadingGif from './img/loading.gif';

import styles from './index.module.less';

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

export const Spin = (props: SpinProps) => {
  const { indicator: _indicator, width = 62, className, fixed, centered = true, absolute, ...remainingProps } = props;

  const indicator = _indicator ?? <img src={LoadingGif} style={{ width, height: 'auto' }} alt="" />;

  return (
    <div
      className={classNames(className, {
        [styles.centered]: centered,
        [styles.fixed]: fixed,
        [styles.absolute]: absolute,
      })}
    >
      <AntdSpin indicator={indicator} {...remainingProps} />
    </div>
  );
};
