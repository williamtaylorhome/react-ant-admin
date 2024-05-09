import { getMenus, USER_INFO, MENU, LAYOUT_MODE, COMPONENTS_VISIBEL, TOKEN } from "@/common";

// Get default page
async function getDefaultMenu() {
  let openKeys = [],
    selectKey = [],
    openedMenu = [];
  const menu = await getMenus();
  menu.some((list) => {
    const child = list[MENU_CHILDREN];
    if (child && child.length) {
      openKeys = [list[MENU_KEY]];
      selectKey = [child[0][MENU_KEY]];
      openedMenu = [child[0]];
      return true;
    }
    return false;
  });

  return {
    openKeys,
    selectKey,
    openedMenu,
  };
}

function getSessionUser() {
  return getKey(false, USER_INFO);
}

function saveUser(info) {
  setKey(true, USER_INFO, info);
  setKey(false, USER_INFO, info);
}

function sleep(seconed) {
  return new Promise((res, rej) => {
    setTimeout(res, seconed);
  });
}

function getLocalUser() {
  return getKey(true, USER_INFO);
}

function getMenuParentKey(list, key) {
  const keys = [];
  const info = list.find((item) => item[MENU_KEY] === key);
  let parentKey = info ? info[MENU_PARENTKEY] : info;
  if (parentKey) {
    const data = getMenuParentKey(list, parentKey);
    keys.push(...data);
    keys.push(String(parentKey));
  }
  return keys;
}

function reduceMenuList(list, path = "") {
  const data = [];
  list.forEach((i) => {
    const { [MENU_CHILDREN]: children, ...item } = i;
    item[MENU_PARENTPATH] = path;
    if (children) {
      const childList = reduceMenuList(children, path + i[MENU_PATH]);
      data.push(...childList);
    }
    data.push(item);
  });
  return data;
}

export function formatMenu(list) {
  const newList = list.map(item => ({ ...item }))
  const menuMap = {};
  const parentMenu = [];
  newList.forEach((item) => {
    // The key of the current menu
    const currentKey = item[MENU_KEY];
    // The parent menu key of the current menu
    const currentParentKey = item[MENU_PARENTKEY];
    // If the mapping table does not have a value yet, assign the current item to it.
    if (!menuMap[currentKey]) {
      menuMap[currentKey] = item;
    } else {
      // There is a value. Description: There are subkeys. Keep the subkeys. Assign the current value to it.
      item[MENU_CHILDREN] = menuMap[currentKey][MENU_CHILDREN];
      menuMap[currentKey] = item;
    }
    // If the current item has a parent
    if (currentParentKey) {
      // The parent is not yet on the mapping table
      if (!menuMap[currentParentKey]) {
        // Then map it to only the subset attribute <Array> type
        menuMap[currentParentKey] = {
          [MENU_CHILDREN]: [item],
        };
      } else if (
        menuMap[currentParentKey] &&
        !menuMap[currentParentKey][MENU_CHILDREN]
      ) {
        // The parent is on the mapping table but there is no subset
        menuMap[currentParentKey][MENU_CHILDREN] = [item];
      } else {
        // The parent has it, and the child collection has it too.
        menuMap[currentParentKey][MENU_CHILDREN].push(item);
      }
    } else {
      // If the current item has no parent, then the current item is the parent item.
      parentMenu.push(item);
    }
  });
  return parentMenu;
}

function getLocalMenu() {
  return getKey(false, MENU);
}

function saveLocalMenu(menu) {
  setKey(false, MENU, menu);
}

function saveToken(token) {
  setKey(true, TOKEN, token);
}

function getToken() {
  return getKey(true, TOKEN);
}

function getKey(isLocal, key) {
  return JSON.parse(getStorage(isLocal).getItem(key) || "null");
}
function getStorage(isLocal) {
  return isLocal ? window.localStorage : window.sessionStorage;
}
function setKey(isLocal, key, data) {
  getStorage(isLocal).setItem(key, JSON.stringify(data || null));
}

function rmKey(isLocal, key) {
  getStorage(isLocal).removeItem(key);
}

function stopPropagation(e) {
  e.stopPropagation();
}

function getLayoutMode() {
  return getKey(true, LAYOUT_MODE);
}
function setLayoutMode(data) {
  setKey(true, LAYOUT_MODE, data);
}

/**
 * A set of local data deleted
 * @param {Array} keys Key values ​​of a set of local data deleted
 */
function clearLocalDatas(keys) {
  keys.forEach((key) => {
    rmKey(true, key);
    rmKey(false, key);
  });
}
function getCompVisibel() {
  return getKey(true, COMPONENTS_VISIBEL);
}
function setCompVisibel(val) {
  return setKey(true, COMPONENTS_VISIBEL, val);
}
export {
  getDefaultMenu,
  getSessionUser,
  saveUser,
  sleep,
  getLocalUser,
  getMenuParentKey,
  reduceMenuList,
  getLocalMenu,
  saveLocalMenu,
  saveToken,
  getToken,
  getKey,
  setKey,
  rmKey,
  stopPropagation,
  getLayoutMode,
  setLayoutMode,
  clearLocalDatas,
  getCompVisibel,
  setCompVisibel,
};
