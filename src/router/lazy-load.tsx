import { Spin } from "@/components/basic";
import React, { Suspense } from "react";

// 可以使用该方法来生成懒加载的组件，这样在路由配置表里使用更加方便点
// eslint-disable-next-line no-undef
export function lazyLoad(
  Comp: React.LazyExoticComponent<(props: Record<string, any>) => JSX.Element>
) {
  return (
    <Suspense fallback={<Spin />}>
      <Comp />
    </Suspense>
  );
}
