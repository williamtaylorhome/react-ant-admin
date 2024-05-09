import React, { useState } from "react";
import { Input, Row, Col } from "antd";
import MyIcon from "@/components/icon";
import "./index.less";
const iconData = require("@/assets/json/iconfont");
const prefix_name = iconData.css_prefix_text;
const initData = iconData.glyphs.map((item) => ({
  ...item,
  type: prefix_name + item.font_class,
}));

function useIcons() {
  const [icons, setIcons] = useState(initData);
  const change = (e) => {
    const val = e.target.value;
    if (!val || !val.replace(/\s/g, "")) {
      setIcons(initData);
      return;
    }
    const newData = initData.filter((i) => i.name.includes(val));
    setIcons(newData);
  };
  return { change, icons };
}

export default function Icons() {
  const { change, icons } = useIcons();
  return (
    <div className="icons-container">
      <h2>Icon customization</h2>
      <div className="mt10">You can use ant design's semantic vector graphics.</div>
      <div className="mt10">
        Additionally, you can
        <a href="https://www.iconfont.cn/" target="_blank" rel="noreferrer">
          iconfont
        </a>
        To add a custom icon, use type="*" on the component created with create from iconfont cn
      </div>
      <Row className="mt10">
        <Col span={8}>
          <Input placeholder="Search local library of relevant icons" onChange={change} />
        </Col>
      </Row>
      <Row className="mt10 pd10">
        {icons.map((item) => {
          return (
            <Col span={2} className="icon-item" key={item.icon_id}>
              <MyIcon type={item.type} />
              <div>{item.type}</div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

Icons.route = { path: "/icons" };