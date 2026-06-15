const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("linktree_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("linktree_token", token);
  else localStorage.removeItem("linktree_token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export async function fetchDB() {
  return request("/db");
}

export async function saveDB(data) {
  return request("/db", { method: "PUT", body: JSON.stringify(data) });
}

export async function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function resetDB() {
  return request("/db/reset", { method: "POST" });
}
