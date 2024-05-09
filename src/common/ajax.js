import axios from "axios";
import { message, notification } from "antd";
import { getToken, clearLocalDatas } from "@/utils";
import { USER_INFO, TOKEN, MENU } from "@/common"
import qs from "qs";
// Request address
const BASE_URL = process.env.REACT_APP_API_BASEURL || "/api/react-ant-admin";

// error message
const codeMessage = {
  200: "The server successfully returns the requested data.",
  201: "Create or modify data successfully.",
  202: "A request has been queued in the background (asynchronous task).",
  204: "Data deleted successfully.",
  400: "There was an error in the request issued, and the server did not create or modify data.",
  401: "The user does not have permissions (wrong token, username, password).",
  403: "The user is authorized, but access is prohibited.",
  404: "The request was made for a record that does not exist, and the server did not perform the operation.",
  406: "The requested format is not available.",
  410: "The requested resource has been permanently deleted and will not be available again.",
  422: "When creating an object, a validation error occurred.",
  500: "A server error occurred, please check the server.",
  502: "Gateway error.",
  503: "The service is unavailable and the server is temporarily overloaded or undergoing maintenance.",
  504: "Gateway timeout.",
};

// Request configuration file
const config = {
  // `baseURL` will automatically be prepended to `url` unless `url` is an absolute URL.
// It is convenient to pass relative URLs to axios instance methods by setting a `baseURL`
  baseURL: BASE_URL,

  timeout: 1000 * 15,

  // `withCredentials` indicates whether credentials are required when making cross-domain requests
  withCredentials: false,

  // `maxRedirects` defines the maximum number of redirects for follow in node.js
// If set to 0, no redirects will be followed
  maxRedirects: 3,
  headers: {
    "Content-Type": " application/json;charset=UTF-8",
  },
};

// Create ajax instance
const instance = axios.create(config);
instance.interceptors.request.use(
  function (config) {
    // What to do before sending a request
    let token = getToken();
    if (token) {
      config.headers["authorization"] = token;
    }
    return config;
  },
  function (error) {
    // What to do about request errors
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      let { msg, status } = response.data;
      if (status === 1) {
        message.error(msg);
      }
    }
    return response && response.data;
  },
  function (error) {
    const { response, message } = error;
    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, config } = response;
      notification.error({
        message: `Request error ${status}: ${config.url}`,
        description: errorText,
      });
      if (response.status === 401 || response.status === 403) {
        clearLocalDatas([USER_INFO, TOKEN, MENU]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else if (!response) {
      let description =
        message === "Network Error"
          ? "Network error, please check whether there is a network failure on the client or the server cannot respond."
          : "An error occurred on the client side";
      clearLocalDatas(["token"]);
      notification.error({
        description,
        message: "Abnormal status",
      });
    }
    // Do something about the response error
    return Promise.reject(error);
  }
);
const rewirteGet = instance.get;
instance.get = function (url, data, ...any) {
  let query = qs.stringify(data, { addQueryPrefix: true });
  return rewirteGet(url + query, ...any);
};
export default instance;
