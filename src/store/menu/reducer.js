import * as actionTypes from "./actionTypes";

const initGlobalState = {
  openedMenu: [], // Save the opened menu bar for use in the sidebar
  openMenuKey: [], // The key of the opened menu bar is used for top navigation
  selectMenuKey: [], // Select the key user sidebar of the menu bar
  menuList: [], // User menu list
  currentPath: "", // Page current path
};

export default function reducer(state = initGlobalState, action) {
  const { key, type, menuItem, keys, list, path } = action;
  switch (type) {
    case actionTypes.ADDOPENTMENU: {
      if (menuItem && !state.openedMenu.find((i) => i.path === menuItem.path)) {
        const openedMenu = [...state.openedMenu];
        openedMenu.push(menuItem);
        return { ...state, openedMenu };
      }
      return state;
    }
    case actionTypes.SET_OPENKEY: {
      let oldKeys = state.openMenuKey;
      let isSame = keys.every((item, index) => item === oldKeys[index]);
      let flag = keys.length === oldKeys.length && isSame;
      if (flag) {
        return state;
      }
      return { ...state, openMenuKey: keys };
    }
    case actionTypes.SET_SELECTKEY: {
      if (state.selectMenuKey[0] === keys[0]) {
        return state;
      }
      return { ...state, selectMenuKey: keys };
    }
    case actionTypes.FILTER_OPENKEY: {
      const openedMenu = state.openedMenu.filter((i) => !key.includes(i.path));
      if (state.openedMenu.length === openedMenu.length) {
        return state;
      }
      return { ...state, openedMenu };
    }
    case actionTypes.SET_USERMENU: {
      return { ...state, menuList: list };
    }
    case actionTypes.SETCURRENTPATH: {
      return { ...state, currentPath: path }
    }
    default: {
      return state;
    }
  }
}
