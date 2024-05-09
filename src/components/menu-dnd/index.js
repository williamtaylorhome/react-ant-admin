import React, { useEffect, useState, useMemo } from "react";
import MyIcon from "@/components/icon";
import { useHistory } from "react-router-dom";
import "./index.less"
import { message } from "antd";
import ContextMenu from "../contextMenu";
import { useDispatchMenu, useStateCurrentPath, useStateOpenedMenu } from "@/store/hooks";
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers';
import { createPortal } from "react-dom";

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

function MenuDnd() {
  const [data, setData] = useState([]);
  const [contextMenuVisible, setVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const history = useHistory();
  const openedMenu = useStateOpenedMenu()
  const currentPath = useStateCurrentPath()
  const { stateFilterOpenMenuKey: filterOpenMenu } = useDispatchMenu()
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    }),
    useSensor(MouseSensor),
  );
  // Add drag and drop options to the selected menu
  useEffect(() => {
    if (data.length !== openedMenu.length) {
      let old = [...data];
      openedMenu.forEach((item) => {
        if (!data.find((i) => i.path === item.path)) {
          old.push(item);
        }
      });
      old = old.filter((i) => openedMenu.find((item) => item.path === i.path));
      setData(old)
    }
  }, [openedMenu, data]);

  //End of drag
  const onDragEnd = (result) => {
    const { active, over } = result;
    setActiveId(null);
    if (active && over && active.id !== over?.id) {
      setData((items) => {
        const oldIndex = items.findIndex((i) => i.path === active.id);
        const newIndex = items.findIndex((i) => i.path === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Close current top menu
  const closeCurrent = (item) => {
    const newData = data.filter((i) => i.path !== item.path);
    const next = newData[newData.length - 1];
    if (next) {
      setData(newData);
    }
    const isCurrent = item.path === currentPath
    filterOpenMenu([item.path])
    if (next && isCurrent) {
      history.replace(next.path);
    } else if (isCurrent && !next) {
      history.replace("/")
    }
  }

  // close right
  const closeRight = () => {
    if (!currentItem) {
      return
    }
    const findIndex = data.findIndex(item => item.path === currentItem.path)
    console.log(findIndex);
    // If on the last selection close the right
    if (findIndex === data.length - 1) {
      return message.warning("No closing items on the right")
    }
    const keys = data.slice(findIndex + 1).map(i => i.path)
    console.log(keys);
    filterOpenMenu(keys)
    history.replace(currentItem.path)

  }

  // close left
  const closeLeft = () => {
    if (!currentItem) {
      return
    }
    const findIndex = data.findIndex(item => item.path === currentItem.path)
    console.log(findIndex);
    // If on last selection close left
    if (findIndex === 0) {
      return message.warning("No closing items on the left")
    }
    const keys = data.slice(0, findIndex).map(i => i.path)
    console.log(keys);
    filterOpenMenu(keys)
    history.replace(currentItem.path)
  }
  // Close all
  const closeAll = () => {
    const keys = data.map(i => i.path)
    console.log(keys);
    filterOpenMenu(keys)
    history.replace("/")
  }

  // Right click to open pop-up menu
  const onContextMenu = (e, item) => {
    const { clientX: x, clientY: y } = e
    e.stopPropagation()
    e.preventDefault()
    setVisible(true)
    setCurrentItem(item)
    setPoint({ x, y })
    return false
  }

  // Right click and select Close
  const onContextMenuClose = (type) => {
    switch (type) {
      case "current":
        closeCurrent(currentItem)
        break;
      case "right":
        closeRight()
        break
      case "left":
        closeLeft()
        break
      case "all":
        closeAll()
        break
      default:
        break;
    }
  }

  const sortItmes = useMemo(() => {
    return data.map(item => ({ id: item.path, ...item }))
  }, [data])
  const overlay = () => {
    const item = openedMenu.find(item => item.path === activeId)
    return createPortal(
      <DragOverlay
        adjustScale={false}
        dropAnimation={dropAnimationConfig}
      >
        {activeId ? (
          <SortableItem
            key={activeId}
            id={activeId}
            toLink={history.push}
            onContextMenu={onContextMenu}
            clsName={currentPath === item.path ? "dnd-items active" : 'dnd-items'}
            onClick={closeCurrent} item={item}
          />
        ) : null}
      </DragOverlay>,
      document.querySelector(".dnd-body") || document.body
    )
  }
  return (<div className="dnd-body hide-scrollbar">
    <DndContext

      onDragStart={({ active }) => {
        if (!active) {
          return;
        }
        setActiveId(active.id);
      }}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
      collisionDetection={closestCenter}
      sensors={sensors}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext items={sortItmes} strategy={horizontalListSortingStrategy} >
        {sortItmes.map(item => (<SortableItem
          key={item.id}
          id={item.id}
          toLink={history.push}
          onContextMenu={onContextMenu}
          clsName={currentPath === item.path ? "dnd-items active" : 'dnd-items'}
          onClick={closeCurrent} item={item}
        />))}
      </SortableContext>
      {overlay()}
    </DndContext >
    <ContextMenu
      {...point}
      isCurrent={Boolean(currentItem && currentItem.path === currentPath)}
      onClose={onContextMenuClose}
      visible={contextMenuVisible}
      setVisible={setVisible}
    />
  </div>);
}

export default MenuDnd


function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  let tm = transform ? { ...transform, scaleX: 1, scaleY: 1 } : transform
  const style = {
    transform: CSS.Transform.toString(tm),
    transition,
    display: "inline-block",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} >
      <div
        className={props.clsName}
        {...listeners}
        onClick={() => {
          props.toLink(props.item.path)
        }}
        onContextMenu={(e) => props.onContextMenu(e, props.item)}
      >
        {props.item.title}
        <MyIcon
          className="anticon-close"
          type="icon_close"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            props.onClick(props.item)
          }}
        />
      </div>
    </div>
  );
}
