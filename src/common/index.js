import { getLocalMenu, saveLocalMenu } from "../utils";
import { getMenu } from "@/api";

// Solve the problem of multiple request menu
let currentMenuJob
function getMenus() {
  if (currentMenuJob) {
    return currentMenuJob
  }
  const job = new Promise((resolve) => {
    let localMenu = getLocalMenu();
    if (localMenu) {
      return resolve(localMenu);
    }
    getMenu()
      .then((result) => {
        if (result) {
          saveLocalMenu(result);
          resolve(result);
        }
      })
      .catch((err) => {
        resolve([]);
      });
  })
  currentMenuJob = job
  job.finally(() => currentMenuJob = null)
  return job
}

export { getMenus };
export * from "./var"
export { default as ajax } from "./ajax"
