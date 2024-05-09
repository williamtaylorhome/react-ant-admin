import { createFromIconfontCN } from "@ant-design/icons";

const MyIcon = createFromIconfontCN({
  scriptUrl: process.env.PUBLIC_URL+"/iconfont.js", // Generate "//at.alicdn.com/t/font_2467607_sf5ou36jx9q.js" on iconfont.cn
});

export default function Icon({ type, ...itemProps }) {
  if (!type) return null;
  return <MyIcon type={type} {...itemProps} />;
}
