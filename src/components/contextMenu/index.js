import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./index.less"

function onContextMenu(e) {
  e.stopPropagation()
  e.preventDefault()
  return false
}
export default function ContextMenu({ isCurrent, visible, x, y, setVisible, onClose }) {
  const ref = useRef()
  const [style, setStyle] = useState({})

  const display = useMemo(() => {
    if (visible) {
      return "block"
    }
    return "none"
  }, [visible])

  const visibility = useMemo(() => {
    if (visible) {
      document.body.style.overflow = "hidden"
      return "visible"
    }
    document.body.style.overflow = "unset"
    return "hidden"
  }, [visible])

  useEffect(() => {
    const wwidth = window.screen.availWidth || document.body.offsetWidth
    const width = ref.current.offsetWidth
    let left = x, top = y;
    if (x + width > wwidth) {
      left = x - width
    }
    const newStyle = { left, top, visibility }
    setStyle(newStyle)
  }, [x, y, visibility, ref])
  // Close menu
  const closeMenu = useCallback(() => {
    if (visibility === "visible") {
      console.log("Close pop-up window");
      setVisible(false)
    }
    return false
  }, [setVisible, visibility])

  // Close all options
  const closeAll = useCallback((e) => {
    e.stopPropagation()
    console.log("Close all");
    onClose("all")
    closeMenu()
  }, [closeMenu, onClose])

  // Close options on the right
  const closeRight = useCallback((e) => {
    e.stopPropagation()
    console.log("right");
    onClose("right")
    closeMenu()
  }, [closeMenu, onClose])

  // Close left option
  const closeLeft = useCallback((e) => {
    e.stopPropagation()
    console.log("left");
    onClose("left")
    closeMenu()
  }, [closeMenu, onClose])

  // Close current option
  const closeCurrent = useCallback((e) => {
    e.stopPropagation()
    console.log("current");
    onClose("current")
    closeMenu()
  }, [closeMenu, onClose])

  return <div
    onContextMenu={onContextMenu}
    onMouseUp={closeMenu}
    style={{ display }}
    className="centext-menu"
  >
    <ul style={style} ref={ref}>
      <li onMouseUp={closeAll}>Close all</li>
      <li onMouseUp={closeRight}>close right</li>
      <li onMouseUp={closeLeft}>close left</li>
      {
        isCurrent && <li onMouseUp={closeCurrent}>Close current</li>
      }
    </ul>
  </div>
}