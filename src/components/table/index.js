import { useEffect, useState } from "react";
import {
  Table,
  Row,
  Drawer,
  Radio,
  Tooltip,
  InputNumber,
  Button,
  message,
  notification,
} from "antd";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import MyIcon from "../icon";
import arrayMove from "array-move";
import { getKey, setKey, rmKey } from "@/utils";
import "./index.less";

const DragHandle = sortableHandle(() => (
  <MyIcon type="icon_mirrorlightctrl" className="drag-sort" />
));
const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
const setColTitle = [
  {
    title: "Column sort",
    dataIndex: "sort",
    className: "drag-visible",
    render: () => <DragHandle />,
  },
  {
    title: "Column name",
    dataIndex: "title",
    className: "drag-visible",
    align: "center",
  },
  {
    title: "width",
    dataIndex: "width",
    type: "inputNumber",
  },
  {
    title: "fixed",
    dataIndex: "fixed",
    width: 120,
    type: "switch",
    align: "center",
    range: [
      { v: false, t: "close" },
      { v: "left", t: "left fixed" },
      { v: "right", t: "right fixed" },
    ],
  },
  {
    title: "Hide beyond width",
    dataIndex: "ellipsis",
    type: "switch",
    align: "center",
    range: [
      { v: false, t: "no" },
      { v: true, t: "yes" },
    ],
  },
  {
    title: "Alignment",
    dataIndex: "align",
    type: "switch",
    align: "center",
    range: [
      { v: "left", t: "left" },
      { v: "center", t: "center" },
      { v: "right", t: "right" },
    ],
  },
  {
    title: "hidden",
    dataIndex: "hidden",
    type: "switch",
    align: "center",
    range: [
      { v: "hidden", t: "hidden" },
      { v: "auto", t: "show" },
    ],
  },
];

const defaultCol = {
  width: 80,
  fixed: false,
  ellipsis: false,
  align: "left",
  hidden: "auto",
};

function UseTable(columns, saveKey) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [col, setCol] = useState([]); // show table
  const [tbTitle, setTitle] = useState([]); // Set up table
  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = col.findIndex((x) => x.index === restProps["data-row-key"]);
    return <SortableItem index={index} {...restProps} />;
  };
  useEffect(() => {
    const data = getKey(true, saveKey);
    if (saveKey && data && columns && columns.length === data.length) {
      const columnInfo = {},
        dataInfo = {};
      columns.forEach((item) => (columnInfo[item.dataIndex] = item));
      data.forEach((item) => (dataInfo[item.dataIndex] = item));
      const isSameKey = Array.isArray(data)
        ? data.every((i) => i.dataIndex === columnInfo[i.dataIndex]?.dataIndex)
        : false;
      if (isSameKey) {
        // If the current table header data is the same as the array length set by the cache, the cached one will be used first.
        const merge = data.map((item) => ({
          ...defaultCol,
          ...columnInfo[item.dataIndex],
          ...item,
        }));
        setCol(merge);
      } else {
        initDefaultCol();
      }
    } else if (!data && columns && columns.length !== col.length) {
      // If the number of table headers is incorrect, initialize the default configuration.
      initDefaultCol();
    }
    // Eslint disable next line
  }, [saveKey, columns]);

  // Table settings rendering
  useEffect(() => {
    if (col.length !== 0) {
      const newTb = setColTitle.map((c) => {
        if (c.type === "switch") {
          c.render = (...args) => switchRender(c, ...args);
        }
        if (c.type === "inputNumber") {
          c.render = (...args) => inuputRender(c.dataIndex, ...args);
        }
        return c;
      });
      setTitle(newTb);
    }
    // Eslint disable next line
  }, [col]);
  // Drawer options component display
  function switchRender(column, text, current) {
    return (
      <Radio.Group
        buttonStyle="solid"
        value={text}
        onChange={(e) =>
          switchChange(column.dataIndex, e.target.value, current)
        }
      >
        {column.range &&
          column.range.map((r) => (
            <Row className="mt10" key={r.t} justify="center">
              <Tooltip title={r.t} arrowPointAtCenter>
                <Radio value={r.v}>{r.t}</Radio>
              </Tooltip>
            </Row>
          ))}
      </Radio.Group>
    );
  }
  // Options in the table trigger changes to reset the table header display
  function switchChange(key, val, current) {
    const dataIndex = current.dataIndex;
    const newCol = col.map((item) => {
      if (item.dataIndex === dataIndex) {
        item[key] = val;
      }
      return item;
    });
    setCol(newCol);
  }
  // render input
  function inuputRender(dataIndex, text, col) {
    return (
      <Tooltip title="Loss of focus trigger" arrowPointAtCenter>
        <InputNumber
          min={0}
          max={800}
          onStep={(v) => switchChange(dataIndex, v, col)}
          onBlur={(v) => switchChange(dataIndex, Number(v.target.value), col)}
          value={text}
        />
      </Tooltip>
    );
  }

  function hiddin() {
    setShowDrawer(false);
  }
  function show() {
    setShowDrawer(true);
  }
  // Drawer component sorting
  function onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(col), oldIndex, newIndex).filter(
        (el) => !!el
      );
      setCol(newData);
    }
  }
  // Click to save the configuration table to display
  function saveTbSet() {
    if (!saveKey) {
      return notification.error({
        type: "error",
        description: "You have not defined the savaKey attribute of the table. Please define it and save it.",
        message: "Save failed",
      });
    }
    setKey(true, saveKey, col);
    message.success("Save settings successfully!");
  }
  // Delete saved table display
  const delTbSet = () => {
    if (!saveKey) {
      return notification.error({
        type: "error",
        description: "You have not defined the sava key attribute of the table. Please define it and click delete.",
        message: "failed to delete",
      });
    }
    rmKey(true, saveKey);
    initDefaultCol();
    message.success("successfully deleted!");
  };
  // Initialize table default format
  function initDefaultCol() {
    const newCol = columns.map((c, index) => ({
      ...defaultCol,
      ...c,
      index,
    }));
    setCol(newCol);
  }
  return {
    col,
    showDrawer,
    show,
    hiddin,
    tbTitle,
    delTbSet,
    DraggableContainer,
    DraggableBodyRow,
    saveTbSet,
  };
}

function MyTable({
  columns,
  dataSource,
  className,
  children,
  saveKey,
  ...Props
}) {
  const {
    showDrawer,
    show,
    hiddin,
    col,
    tbTitle,
    delTbSet,
    DraggableContainer,
    DraggableBodyRow,
    saveTbSet,
  } = UseTable(columns, saveKey);

  return (
    <div className="react-ant-table">
      <Row className="set" justify="end">
        <MyIcon type="icon_edit" onClick={show} />
      </Row>
      <Table
        columns={col.filter((i) => i.hidden !== "hidden")}
        dataSource={dataSource}
        className={
          className
            ? `table-show-container ${className}`
            : "table-show-container"
        }
        {...Props}
      >
        {children}
      </Table>
      <Drawer
        className="table-drawer"
        width={1000}
        onClose={hiddin}
        maskClosable={true}
        visible={showDrawer}
        title="Table display settings"
      >
        <Table
          columns={tbTitle}
          dataSource={col}
          rowKey="index"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
          pagination={false}
        />
        <Row justify="center" className="mt20">
          <Button type="primary" onClick={saveTbSet}>
            Save this table setting and enable it by default next time you open it.
          </Button>
          <Button danger type="ghost" className="del" onClick={delTbSet}>
            Delete saved settings
          </Button>
        </Row>
      </Drawer>
    </div>
  );
}
export default MyTable;
