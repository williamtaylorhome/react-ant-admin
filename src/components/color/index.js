import React, { memo, useCallback, useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { Row, Col, Button } from "antd";
import "./index.less";

const getPositon = (x, y) => ({ left: x, top: y });

function Color({
  color,
  pageX,
  pageY,
  onSureChange,
  colorKey,
  isShow,
  onClose,
}) {
  const [changeColor, setColor] = useState(color);

  // change reset
  useEffect(() => {
    if (color) {
      setColor(color);
    }
  }, [color]);

  // synchronous changes
  const onChange = useCallback((v) => {
    setColor(v);
  }, []);

  // confirm
  const onChangeComplete = useCallback(() => {
    onSureChange(changeColor, colorKey);
  }, [changeColor, onSureChange, colorKey]);

  return (
    <Row
      className={isShow ? "fixed-wrapper show" : "fixed-wrapper"}
      style={getPositon(pageX, pageY)}
      onClick={(e) => e.stopPropagation()}
    >
      <Col>
        <SketchPicker color={changeColor} onChange={onChange} />
      </Col>
      <Col>
        <Button type="primary" size="small" onClick={onChangeComplete}>
          confirm
        </Button>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
      </Col>
    </Row>
  );
}
export default memo(
  Color,
  (prev, next) =>
    prev.color === next.color &&
    prev.colorKey === next.colorKey &&
    prev.isShow === next.isShow &&
    prev.pageY === next.pageY &&
    prev.pageX === next.pageX &&
    prev.onSureChange === next.onSureChange &&
    prev.onClose === next.onClose
);
