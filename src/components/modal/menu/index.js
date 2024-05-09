import React, { useEffect, useState } from "react";
import MyIcon from "@/components/icon";
import MyForm from "@/components/form";
import { Modal, Select, message } from "antd";
import { addMenu, getMenuInfo, editMenu } from "@/api";
import "./index.less";

const ICON_JSON = require("@/assets/json/iconfont.json");
const ICON_PREFIX = ICON_JSON.css_prefix_text;
const ICON_DATA = ICON_JSON.glyphs;

const { Option } = Select;
const initFormItems = [
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the menu title" }],
      label: "menu title",
      name: "title",
    },
    childProps: {
      placeholder: "menu title",
    },
  },
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the menu path" }],
      label: "menu path",
      name: "path",
    },
    childProps: {
      placeholder: "menu path",
    },
  },
  {
    itemType: "select",
    itemProps: {
      label: "Parent menu",
      name: MENU_PARENTKEY,
    },
    childProps: {
      placeholder: "Parent menu",
    },
  },
  {
    itemType: "select",
    itemProps: {
      label: "menu icon",
      name: "icon",
    },
    childProps: {
      placeholder: "icon",
      allowClear: true,
      showSearch: true,
      getPopupContainer: (v) => v,
      children: ICON_DATA.map((icon) => (
        <Option value={ICON_PREFIX + icon.font_class} key={icon.icon_id}>
          <div className="icons">
            <MyIcon type={ICON_PREFIX + icon.font_class} />
            <span className="title"> {icon.font_class}</span>
          </div>
        </Option>
      )),
    },
  },
  {
    itemType: "radio",
    itemProps: {
      rules: [{ required: true, message: "Please select menu caching mode" }],
      name: MENU_KEEPALIVE,
      label: "Is the page cached?",
    },
    childProps: {
      options: [
        { label: "yes", value: "true" },
        { label: "no", value: "false" },
      ],
    },
  },
  {
    itemType: "inputNumber",
    itemProps: {
      className: "ipt-number",
      rules: [
        {
          type: "number",
          min: 0,
          max: 10000,
          message: "Please fill in the menu sort size correctly",
        },
        { required: true, message: "Please fill in the menu sort size" },
      ],
      name: MENU_ORDER,
      label: "Menu sorting",
    },
    childProps: {
      placeholder: "The smaller the value, the higher it is.",
    },
  },
];
const titleType = {
  add: "New menu",
  addChild: "Add submenu",
  edit: "Modify menu information",
};

function getMenuList(list, id) {
  let menu = []
  const findList = (ls) => {
    return ls.some(item => {
      let l = item[MENU_CHILDREN]
      if (item[MENU_KEY] === id) {
        menu = ls
        return true
      } else if (Array.isArray(l) && l.length) {
        let d = findList(l)
        if (d) {
          menu = l
        }
        return d
      }
      return false
    })
  }
  findList(list)
  return menu
}

export default function MenuModal({
  info,
  modalType = "add",
  isShow,
  setShow,
  updateMenu,
  menus = [],
}) {
  const [form, setForm] = useState(null);
  const [formItems, setItems] = useState([]);
  // form item
  useEffect(() => {
    if (modalType !== "add" && menus && info) {
      let items = [...initFormItems.map((i) => ({ ...i }))];
      items.forEach((i) => {
        if (i.itemProps.name === MENU_PARENTKEY) {
          let disabled = modalType === "addChild" || (modalType === "edit" && info.isParent);
          i.childProps.disabled = disabled
          let childrenList = modalType === "addChild" ? getMenuList(menus, info[MENU_KEY]) : menus
          i.childProps.children = childrenList.map((menu) => (
            <Option value={menu[MENU_KEY]} key={menu[MENU_KEY]}>
              <div className="icons">
                <MyIcon type={menu[MENU_ICON]} />
                <span className="title"> {menu[MENU_TITLE]}</span>
              </div>
            </Option>
          ));
        }
      });
      items.push({
        itemType: "input",
        itemProps: {
          hidden: true,
          label: "menu id",
          name: MENU_KEY,
        },
      })
      setItems(items);
    } else if (info && modalType === "add" && menus) {
      let items = [...initFormItems.map((i) => ({ ...i }))];
      items = items.filter((i) => i.itemProps.name !== MENU_PARENTKEY);
      setItems(items);
    }
  }, [modalType, info, menus]);

  useEffect(() => {
    if (modalType === "edit" && isShow && form) {
      getMenuInfo({ [MENU_KEY]: info[MENU_KEY] }).then((res) => {
        if (res.status === 0 && res.data) {
          form.setFieldsValue(res.data);
        }
      });
    } else if (modalType === "addChild" && isShow && form) {
      form.setFieldsValue({
        [MENU_PARENTKEY]: info[MENU_KEY],
      });
    }
  }, [modalType, isShow, info, form]);
  // submit Form
  const submit = () => {
    form.validateFields().then((values) => {
      const activeFn = { add, edit, addChild: add };
      let fn = activeFn[modalType];
      fn(values);
    });
  };

  const onCancel = () => {
    form.resetFields();
    setShow(false);
  };
  function edit(data) {
    editMenu(data).then((res) => {
      const { status, msg } = res;
      if (status === 0) {
        message.success(msg);
        onCancel();
        updateMenu();
      }
    });
  }
  function add(data) {
    addMenu(data).then((res) => {
      const { status, msg } = res;
      if (status === 0) {
        message.success(msg);
        onCancel();
        updateMenu();
      }
    });
  }
  return (
    <Modal
      maskClosable={false}
      title={titleType[modalType]}
      visible={isShow}
      okText="confirm"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={submit}
    >
      <MyForm handleInstance={setForm} items={formItems} />
    </Modal>
  );
}
