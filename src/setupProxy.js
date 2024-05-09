const { createProxyMiddleware } = require("http-proxy-middleware");

const matchUrl = "/api"; // The request is a matching address
const target = "https://z3web.cn/"; // Destination URL
const prevUrl = "^/api"; // Intercept with /api path
const writeUlr = "/api/react-ant-admin"; // Rewrite request path
/**
 * When using local proxy forwarding, please set the config baseURL of src/common/ajax.js axios to "/"
 * Assuming that the local ajax request starts with /api, the target URL target will be requested
 * ajax.post("/api/getlist") Rewrite /api to /api/react-ant-admin
 * Then splice https://z3web.cn/
 * For example: ajax.post("/api/getlist") => https://z3web.cn/api/react-ant-admin/getlist
 */

module.exports = function (app) {
  app.use(
    createProxyMiddleware(matchUrl, {
      target,
      changeOrigin: true, 
      secure: true,// Https
      pathRewrite: { [prevUrl]: writeUlr },
    })
  );
};
