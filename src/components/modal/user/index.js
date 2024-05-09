import React, { useEffect, useState } from "react";
import { Modal, Select, message } from "antd";
import { getPower, addUser, getUser, editUser } from "@/api";
import MyForm from "@/components/form";
const { Option } = Select;

const paswdRule = [{ required: true, message: "Please fill in the login password" }];
const initFormItems = [
  {
    itemType: "input",
    itemProps: {
      name: "username",
      rules: [{ required: true, message: "Please enter your username" }],
      label: "username",
    },
    childProps: {
      placeholder: "username",
    },
  },
  {
    itemType: "input",
    itemProps: {
      name: "account",
      rules: [{ required: true, message: "Please fill in the login account" }],
      label: "Login account",
    },
    childProps: {
      placeholder: "Login account",
    },
  },
  {
    itemType: "input",
    itemProps: {
      name: "pswd",
      label: "login password",
    },
    childProps: {
      placeholder: "Login password, if filled in, it means modification",
      type: "password",
    },
  },
  {
    itemType: "select",
    itemProps: {
      rules: [{ required: true, message: "Please select menu permissions" }],
      name: "type_id",
      label: "Menu permissions",
    },
    childProps: {
      placeholder: "Menu permissions",
    },
  },
];
export default function UserModal({ user_id, isShow, onCancel, onOk }) {
  const [form, setForm] = useState(null);
  const [formItems, setItems] = useState([]);
  useEffect(() => {
    if (isShow) {
      getPower().then((res) => {
        const { data, status } = res;
        if (status === 0) {
          let items = initFormItems.map((i) => ({ ...i }));
          items.forEach((i) => {
            if (i.itemProps.name === "type_id") {
              i.childProps.children = data.map((power) => (
                <Option value={power.type_id} key={power.type_id}>
                  {power.name}
                </Option>
              ));
            }
          });
          setItems(items);
        }
      });
    }
  }, [isShow]);

  useEffect(() => {
    if (user_id && form) {
      getUser({ user_id }).then((res) => {
        if (res.data) {
          form.setFieldsValue(res.data);
        }
      });
      let items = initFormItems.map((i) => ({ ...i }));
      items.forEach((i) => {
        if (i.itemProps.name === "pswd") {
          i.itemProps.rules = null;
        }
      });
      setItems(items);
    } else if (!user_id) {
      // set formItem
      let items = initFormItems.map((i) => ({ ...i }));
      items.forEach((i) => {
        if (i.itemProps.name === "pswd") {
          i.itemProps.rules = paswdRule;
        }
      });
      setItems(items);
    }
  }, [user_id, form]);

  const submit = () => {
    form.validateFields().then((values) => {
      let modify = Boolean(user_id);
      let fn = modify ? editUser : addUser;
      if (modify) {
        values.user_id = user_id;
      }
      fn(values).then((res) => {
        if (res.status === 0) {
          message.success(res.msg);
          close();
          onOk();
        }
      });
    });
  };
  const close = () => {
    form.resetFields();
    onCancel(null, false);
  };
  return (
    <Modal
      maskClosable={false}
      title={user_id ? "Modify information" : "Add account"}
      visible={isShow}
      okText="confirm"
      cancelText="Cancel"
      onCancel={close}
      onOk={submit}
    >
      <MyForm handleInstance={setForm} items={formItems} />
    </Modal>
  );
}
