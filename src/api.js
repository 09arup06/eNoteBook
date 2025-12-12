// src/api.js
const API = process.env.REACT_APP_API_URL || "";

function getToken() {
  return localStorage.getItem("token"); // you set after login
}

async function post(resourcePath, operation, payload = {}, { requireAuth = false } = {}) {
  const url = `${API}${resourcePath}`; // resourcePath example: '/auth' or '/notes' or '/messages'
  const body = { operation, payload };

  const headers = { "Content-Type": "application/json" };
  if (requireAuth) {
    const token = getToken();
    if (!token) throw new Error("No auth token");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  // Some APIs return non-json on errors — try-catch
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch (e) {
    throw new Error(`Invalid JSON response: ${text}`);
  }

  if (!res.ok) {
    const err = json.error || json.message || JSON.stringify(json);
    throw new Error(err);
  }
  return json;
}

export default {
  post,
};
