import { handleGetDB, handlePutDB } from "./lib/handlers.js";

export default async function handler(req, res) {
  if (req.method === "GET") return handleGetDB(req, res);
  if (req.method === "PUT") return handlePutDB(req, res);
  res.statusCode = 405;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Method not allowed" }));
}
