import React, { useState } from "react";
import { Card, Avatar, Row, Col, Typography, Modal, Form, Input } from "antd";
import MyIcon from "@/components/icon";
import "./index.less";

const list = [
  {
    img: "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png",
    title: "Ant Design",
    description:
      "During the development process of middle-end products, different design specifications and implementation methods will appear, but there are often many similar pages and components, and these similar components will be extracted into a set of standard specifications.",
  },
  {
    img: "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png",
    title: "React",
    description:
      "During the development process of middle-end products, different design specifications and implementation methods will appear, but there are often many similar pages and components, and these similar components will be extracted into a set of standard specifications.",
  },
  {
    img: "http://www.axios-js.com/logo.svg",
    title: "axios",
    description:
      "During the development process of middle-end products, different design specifications and implementation methods will appear, but there are often many similar pages and components, and these similar components will be extracted into a set of standard specifications.",
  },
  {
    img: "https://webpack.docschina.org/icon-square-small.85ba630cf0c5f29ae3e3.svg",
    title: "Webpack",
    description:
      "During the development process of middle-end products, different design specifications and implementation methods will appear, but there are often many similar pages and components, and these similar components will be extracted into a set of standard specifications.",
  },
];

const { Meta } = Card;
const dRules = [
  {
    required: true,
    message: "Please input your description!",
  },
  {
    min: 50,
    message: "The description must be more than 50 words!",
  },
];
const tRules = [
  {
    required: true,
    message: "Please input your title!",
  },
];
const iRules = [
  {
    required: true,
    message: "Please input your img!",
  },
];
function useCardPage() {
  const [dataList, setList] = useState(list);
  const [showModal, setShow] = useState(false);
  const [form] = Form.useForm();

  const show = () => {
    setShow(true);
  };
  const hide = () => {
    setShow(false);
  };
  const addList = () => {
    form.validateFields().then((values) => {
      setList([...dataList, values]);
      form.resetFields();
      hide();
    });
  };
  return { show, dataList, showModal, hide, addList, form };
}

export default function CardPage() {
  const { show, showModal, addList, dataList, hide, form } = useCardPage();
  return (
    <div className="card-container">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card hoverable className="add-wapper" onClick={show}>
            <MyIcon type="icon_increase" />
            <p>New</p>
          </Card>
        </Col>
        {dataList.map((item) => (
          <Col span={6} key={item.title}>
            <Card
              hoverable
              actions={[
                <MyIcon type="icon_edit" className="icon" />,
                <MyIcon className="icon" type="icon_setting" />,
              ]}
            >
              <Meta
                avatar={<Avatar src={item.img} />}
                title={item.title}
                description={
                  <Typography.Paragraph ellipsis={{ rows: 3, suffix: "..." }}>
                    {item.description}
                  </Typography.Paragraph>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Add list"
        visible={showModal}
        cancelText="Cancel"
        okText="Add to"
        onOk={addList}
        onCancel={hide}
      >
        <Form form={form}>
          <Form.Item label="image link" name="img" rules={iRules}>
            <Input />
          </Form.Item>
          <Form.Item label="title" name="title" rules={tRules}>
            <Input />
          </Form.Item>
          <Form.Item label="describe" name="description" rules={dRules}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
CardPage.route={ path:"/list/card" }
