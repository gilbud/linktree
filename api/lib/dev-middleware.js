import {
  handleGetDB,
  handlePutDB,
  handleLogin,
  handleResetDB,
} from "./handlers.js";

function createRes() {
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(body) {
      this.body = body;
    },
  };
  return res;
}

export function createApiMiddleware() {
  return async (req, res, next) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (!url.pathname.startsWith("/api/")) return next();

    const method = req.method?.toUpperCase();
    const path = url.pathname;

    try {
      let handlerRes = createRes();

      if (path === "/api/db" && method === "GET") {
        await handleGetDB(req, handlerRes);
      } else if (path === "/api/db" && method === "PUT") {
        await handlePutDB(req, handlerRes);
      } else if (path === "/api/auth/login" && method === "POST") {
        await handleLogin(req, handlerRes);
      } else if (path === "/api/db/reset" && method === "POST") {
        await handleResetDB(req, handlerRes);
      } else {
        return next();
      }

      res.statusCode = handlerRes.statusCode;
      Object.entries(handlerRes.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      res.end(handlerRes.body);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err.message }));
    }
  };
}
