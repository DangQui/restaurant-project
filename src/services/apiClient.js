const BASE_URL = (
  import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:3001/api/"
).replace(/(?<!:)\/\/+/g, "/");
let AUTH_TOKEN = null;

export const setAuthToken = (token) => {
  AUTH_TOKEN = token || null;
};

const buildHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (AUTH_TOKEN) {
    headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return headers;
};

const buildUrl = (path, params) => {
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(
    sanitizedPath,
    BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
  );

  if (params) {
    Object.entries(params)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
      .forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
  }

  return url;
};

const request = async (method, path, { params, body } = {}) => {
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const message =
      errorPayload.error || errorPayload.message || "Request failed";
    throw new Error(message);
  }

  return response.json();
};

export const apiClient = {
  get: (path, options) => request("GET", path, options),
  post: (path, options) => request("POST", path, options),
  put: (path, options) => request("PUT", path, options),
  patch: (path, options) => request("PATCH", path, options),
  delete: (path, options) => request("DELETE", path, options),
};
