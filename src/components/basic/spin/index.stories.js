import { jsx as _jsx } from "react/jsx-runtime";
import { Spin } from '.';
export default {
    title: 'Basic/Spin',
    component: Spin,
    argTypes: {},
};
export const Default = {
    args: {
        tip: 'tip',
        children: _jsx("div", { style: { width: 400, height: 400, textAlign: 'center' }, children: "children" }),
    },
};
