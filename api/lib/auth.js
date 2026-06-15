import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "linktree-dev-secret-change-in-production";

export function createToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const [encoded, sig] = token.replace(/^Bearer\s+/i, "").split(".");
  if (!encoded || !sig) return null;

  const payload = Buffer.from(encoded, "base64url").toString();
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;

  const data = JSON.parse(payload);
  if (data.exp < Date.now()) return null;
  return data;
}

export function requireAdmin(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization;
  const session = verifyToken(auth);
  if (!session || session.role !== "admin") {
    return { error: "Unauthorized", status: 401 };
  }
  return { session };
}
