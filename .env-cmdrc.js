
const devConfig = {
  PORT: 3000, // start port
  HOST: "0.0.0.0", // listening address
  REACT_APP_ROUTERBASE: "/react-ant-admin", // React routing base path
  REACT_APP_API_BASEURL: "http://127.0.0.1:8081/api/react-ant-admin", //Request address
  PUBLIC_URL: "/react-ant-admin",// static file path
}
const proConfig = {
  REACT_APP_ROUTERBASE: "/react-ant-admin", // React routing base path
  REACT_APP_API_BASEURL: "/api/react-ant-admin", //Request address
  PUBLIC_URL: "/react-ant-admin",// static file path
  BUILD_PATH: "react-ant-admin", // Pack folder name
}

/**
 * env-cmd document address https://github.com/toddbluhm/env-cmd#-help
 * Command line usage: env-cmd --verbose -e mode_name node file.js
 * mode_name: corresponds to the attribute (key) in mode, such as development development_color
 * operation result:
 * Get the value corresponding to mode_name Object.keys method and bind key-value to process.env
 * For example: development(mode_name): { test : "123" } => process.env.test = "123"
 * Finally able to use process.env.test throughout the project
 */
const mode = {

  // The local interface runs normally without mocks or theme colors.
  development: devConfig,

  // Local interface Enable theme color operation
  development_color: {
    ...devConfig,
    COLOR: "true", // "true" is enabled
  },

  // Run local mock
  development_mock: {
    ...devConfig,
    REACT_APP_MOCK: "1", // 1 to enable mock
  },

  // Theme color and local mock operation
  development_color_mock: {
    ...devConfig,
    COLOR: "true",
    REACT_APP_MOCK: "1",
  },

  // Packaging: No theme, no mock
  production: proConfig,

  // Packaging: with theme without mock
  production_color: {
    ...proConfig,
    COLOR: "true", // "true" is enabled
  },

  // Packaging: with theme, with mock, pure local mode packaging
  production_color_mock: {
    ...proConfig,
    COLOR: "true",
    REACT_APP_MOCK: "1",
  },

  // GitHub pages packaged for use by bloggers
  production_github: {
    ...proConfig,
    COLOR: "true",
    REACT_APP_API_BASEURL: "",
    REACT_APP_ROUTER_ISHASH: "1", // Enable hash mode
    REACT_APP_ROUTERBASE: "/"
  }
}


module.exports = Promise.resolve(mode)