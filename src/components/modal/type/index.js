import React, { useEffect, useMemo, useState } from "react";
import { Modal, message, Tree } from "antd";
import MyForm from "@/components/form";
import { addType, editType } from "@/api";
import { reduceMenuList } from "@/utils"
const initFormItems = [
  {
    itemType: "input",
    itemProps: {
      rules: [{ required: true, message: "Please fill in the permission name" }],
      label: "Permission name",
      name: "name",
    },
    childProps: {
      placeholder: "Permission name",
    },
  },
  {
    itemType: "input",
    itemProps: {
      name: "type_id",
      hidden: true,
    },
  },
];

function pushParentId(checkList, list, id) {
  const info = list.find(item => item.key === id)
  if (!info) {
    return
  }

  const parentId = info.parentId
  if (parentId && !checkList.includes(parentId)) {
    checkList.push(parentId)
    pushParentId(checkList, list, parentId)
  }
}
function filterParentId(parent, list, id) {
  const find = list.find(item => item.key === id)
  if (!find) {
    return
  }
  const pid = find.parentId
  if (pid) {
    if (!parent.includes(pid)) {
      parent.push(pid)
    }
    filterParentId(parent, list, pid)
  }
}

export default function UserModal({ info, isShow, onCancel, onOk, menuList }) {
  const [form, setForm] = useState(null);
  const [menuId, setMenuId] = useState([]);

  const reducerList = useMemo(() => {
    if (menuList) {
      return reduceMenuList(menuList)
    }
    return []
  }, [menuList])

  useEffect(() => {
    if (info && form && reducerList) {
      const parentId = [], childId = []
      const checkId = info.menu_id.split(",").map(Number)
      checkId.forEach(id => {
        filterParentId(parentId, reducerList, id)
        if (!parentId.includes(id) && !childId.includes(id)) {
          childId.push(id)
        }
      })
      setMenuId(childId);
      form.setFieldsValue(info);
    } else {
      setMenuId([])
    }
  }, [info, form, reducerList]);

  const submit = () => {
    form.validateFields().then((values) => {
      let fn = Boolean(info) ? editType : addType;
      let checkMenuId = []

      menuId.forEach(id => {
        if (!checkMenuId.includes(id)) {
          checkMenuId.push(id)
        }
        pushParentId(checkMenuId, reducerList, id)
      })
      console.log(checkMenuId);
      fn({ ...values, menu_id: checkMenuId }).then((res) => {
        if (res.status === 0) {
          message.success(res.msg);
          close();
          onOk();
        }
      });
    });
  };
  const onCheck = (checked) => {
    setMenuId(checked);
  };
  const close = () => {
    form.resetFields();
    setMenuId([]);
    onCancel(null, false);
  };
  return (
    <Modal
      maskClosable={false}
      title={info ? "Modify permissions" : "Add permissions"}
      visible={isShow}
      okText="confirm"
      cancelText="Cancel"
      onCancel={close}
      onOk={submit}
    >
      <MyForm handleInstance={setForm} items={initFormItems} />
      <Tree
        treeData={menuList}
        fieldNames={{
          title: MENU_TITLE,
          key: MENU_KEY,
          children: MENU_CHILDREN
        }}
        checkable
        defaultExpandAll={true}
        checkedKeys={menuId}
        selectable={false}
        onCheck={onCheck}
      />
    </Modal>
  );
}
