import React, { useCallback, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useDispatch } from "react-redux";
import MyIcon from "@/components/icon";
import { saveUser, getLocalUser, saveToken } from "@/utils";
import { setUserInfoAction } from "@/store/user/action";
import { login } from "@/api";
import "./index.less";

const initialValues = {
  remember: true,
  ...getLocalUser(),
}

const IPT_RULE_USERNAME = [
  {
    required: true,
    message: "please enter user name",
  },
];

const IPT_RULE_PASSWORD = [
  {
    required: true,
    message: "Please enter password",
  },
];

function useLogin(setUserInfo) {
  const [btnLoad, setBtnLoad] = useState(false);
  const onFinish = (values) => {
    setBtnLoad(true);
    login(values)
      .then((res) => {
        const { data, msg, status, token } = res;
        setBtnLoad(false);
        if (status === 1) return;
        saveToken(token);
        data.isLogin = true;
        message.success(msg);
        if (values.remember) {
          saveUser(data);
        }
        setUserInfo(data);
      })
      .catch(() => {
        setBtnLoad(false);
      });
  };
  return { btnLoad, onFinish };
}

function Login() {
  const dispatch = useDispatch()
  const setUserInfo = useCallback((info) => dispatch(setUserInfoAction(info)), [dispatch])
  const { btnLoad, onFinish } = useLogin(setUserInfo);
  return (
    <div className="login-container">
      <div className="wrapper">
        <div className="title">react-ant-admin</div>
        <div className="welcome">Welcome, please log in first</div>
        <Form
          className="login-form"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Form.Item name="account" rules={IPT_RULE_USERNAME}>
            <Input
              prefix={<MyIcon type="icon_nickname" />}
              placeholder="Account:admin/user"
            />
          </Form.Item>
          <Form.Item name="pswd" rules={IPT_RULE_PASSWORD}>
            <Input
              prefix={<MyIcon type="icon_locking" />}
              type="password"
              placeholder="Password:admin123/user123"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item className="btns">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={btnLoad}
            >
              Log in
            </Button>
            <Button htmlType="reset">reset</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
