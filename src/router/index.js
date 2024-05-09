import React, { useEffect, useState, useMemo } from "react";
import { Route } from "react-router-dom";
import { CacheRoute, CacheSwitch } from "react-router-cache-route";
import routerList from "./list";
import Intercept from "./intercept.js";
import { getMenus } from "@/common";
import { formatMenu, reduceMenuList } from "@/utils";
import { useDispatchMenu } from "@/store/hooks";

/**
 *
 * @param {Array} menuList User global user routing list
 * @param {Function} stateSetMenuList sets the global user routing list
 * @returns {Array} Returns the rendered route list component
 */
function useRouter() {
  const { stateSetMenuList } = useDispatchMenu()
  const [ajaxUserMenuList, setAjaxUserMenuList] = useState([]); // Route list returned by network request
  const [mergeRouterList, setMergeLRouterList] = useState([]);// The merged result of the route list returned by the local and interface
  useEffect(() => {
    if (stateSetMenuList && typeof stateSetMenuList === "function") {
      getMenus().then((list) => {
        const formatList = formatMenu(list)
        const userMenus = reduceMenuList(formatList);
        // Merge the requested data with the route list exposed by the local pages page
        let routers = routerList.map((router) => {
          let find = userMenus.find((i) => (i[MENU_PARENTPATH] || "") + i[MENU_PATH] === router[MENU_PATH]);
          if (find) {
            router = { ...find, ...router }; // Local first interface results
          } else {
            router[MENU_KEY] = router[MENU_PATH];
          }
          return router;
        });
        if (list && list.length) {
          stateSetMenuList(formatList);
          setAjaxUserMenuList(userMenus);
          setMergeLRouterList(routers);
        }
      });
    }
  }, [stateSetMenuList]);

  const routerBody = useMemo(() => {
    // Listen to the local routing list and render the routing component when the length is greater than 1.
    if (mergeRouterList.length) {
      return mergeRouterList.map((item) => {
        let { [MENU_KEY]: key, [MENU_PATH]: path } = item;
        const RenderRoute = item[MENU_KEEPALIVE] === "true" ? CacheRoute : Route;
        return (
          <RenderRoute
            key={key}
            exact={true}
            path={path}
            render={(allProps) => (
              <Intercept
                {...allProps}
                {...item}
                menuList={ajaxUserMenuList}
                pageKey={key}
              />
            )}
          />
        );
      });
    }
    return null
  }, [ajaxUserMenuList, mergeRouterList])
  return { routerBody };
}

const Router = () => {
  const { routerBody } = useRouter();
  return <CacheSwitch>{routerBody}</CacheSwitch>;
};

export default Router;
