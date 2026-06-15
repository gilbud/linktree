import { createToken, requireAdmin } from "./auth.js";
import { readDB, writeDB, resetDB } from "./store.js";

function jsonResponse(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === "string") return req.body ? JSON.parse(req.body) : {};
    return req.body || {};
  }

  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

export async function handleGetDB(req, res) {
  try {
    const db = await readDB();
    jsonResponse(res, 200, db);
  } catch (err) {
    jsonResponse(res, 500, { error: err.message });
  }
}

export async function handlePutDB(req, res) {
  const auth = requireAdmin(req);
  if (auth.error) return jsonResponse(res, auth.status, { error: auth.error });

  try {
    const body = await readBody(req);
    if (!body || typeof body !== "object") {
      return jsonResponse(res, 400, { error: "Invalid database payload" });
    }
    await writeDB(body);
    jsonResponse(res, 200, { ok: true });
  } catch (err) {
    jsonResponse(res, 500, { error: err.message });
  }
}

export async function handleLogin(req, res) {
  try {
    const { username, password } = await readBody(req);
    if (!username || !password) {
      return jsonResponse(res, 400, { error: "Username dan password wajib diisi" });
    }

    const db = await readDB();
    const user = db.users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return jsonResponse(res, 401, { error: "Username atau password salah." });
    }

    const { password: _, ...safeUser } = user;
    const token = createToken(user);
    jsonResponse(res, 200, { user: safeUser, token });
  } catch (err) {
    jsonResponse(res, 500, { error: err.message });
  }
}

export async function handleResetDB(req, res) {
  const auth = requireAdmin(req);
  if (auth.error) return jsonResponse(res, auth.status, { error: auth.error });

  try {
    const db = await resetDB();
    jsonResponse(res, 200, db);
  } catch (err) {
    jsonResponse(res, 500, { error: err.message });
  }
}
