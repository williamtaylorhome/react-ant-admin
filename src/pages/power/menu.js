import React, { useEffect, useState } from "react";
import { Row, Button, message, Popconfirm } from "antd";
import { getMenuList as apiGetList, delMenu } from "@/api";
import MenuModal from "@/components/modal/menu";
import MyTable from "@/components/table";
import MyIcon from "@/components/icon";
import "./index.less";

function useMenu() {
  const [menus, setMenu] = useState([]);
  const [tabCol, setCol] = useState([]);
  const [selectInfo, setSelectInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const menuAction = {
    title: "operate",
    dataIndex: "action",
    align: "center",
    render: (text, record) => {
      return (
        <Row>
          <Button type="link" onClick={() => openModal("edit", record)}>
            edit
          </Button>
          <Button type="link" onClick={() => openModal("addChild", record)}>
            Add submenu
          </Button>
          <Popconfirm
            onConfirm={() => deleteMenu(record)}
            okText="confirm"
            title="Deleting the selected menu will also delete all submenus under it. Do you confirm the deletion?"
            cancelText="Cancel"
          >
            <Button type="link" danger>
              delete
            </Button>
          </Popconfirm>
        </Row>
      );
    },
  };

  const getMenuList = () => {
    apiGetList().then((res) => {
      if (res) {
        console.log(res);
        res.mapKey.push(menuAction);
        res.mapKey.forEach((item) => {
          if (item.dataIndex === "icon") {
            item.render = (text) =>
              text ? <MyIcon className="preview" type={text} /> : "Not set yet";
          } else if (item.dataIndex === MENU_KEEPALIVE) {
            item.render = (text) => (text === "true" ? "Keep" : "Close destruction");
          } else if (item.dataIndex === MENU_SHOW) {
            item.render = (t) => t === "true" ? 'show' : 'hide'
          }
        });
        setCol(res.mapKey);
        setMenu(res.data);
      }
    });
  };

  useEffect(() => {
    getMenuList();
    // Eslint disable next line
  }, []);

  const openModal = (type, { [MENU_KEY]: key, [MENU_PARENTKEY]: parentKey }) => {
    setSelectInfo({ [MENU_KEY]: key, isParent: !Boolean(parentKey) });
    setModalType(type);
    setShowModal(true);
  };

  const deleteMenu = (info) => {
    delMenu(info).then((res) => {
      const { msg, status } = res;
      if (status === 0) {
        message.success(msg);
        getMenuList();
      }
    });
  };
  const addMenu = () => {
    openModal("add", {});
  };
  return {
    selectInfo,
    menus,
    showModal,
    modalType,
    tabCol,
    setShowModal,
    getMenuList,
    addMenu,
  };
}

export default function Menu() {
  const {
    selectInfo,
    menus,
    showModal,
    modalType,
    tabCol,
    setShowModal,
    getMenuList,
    addMenu,
  } = useMenu();
  return (
    <div className="powermenu-container">
      <Button type="primary" onClick={addMenu}>
        New menu
      </Button>
      <MyTable dataSource={menus} rowKey={`${MENU_KEY}`} columns={tabCol} saveKey="MENUTABLE" />
      <MenuModal
        menus={menus}
        isShow={showModal}
        info={selectInfo}
        modalType={modalType}
        setShow={setShowModal}
        updateMenu={getMenuList}
      />
    </div>
  );
}

Menu.route = {
  path: "/power/menu",
};
