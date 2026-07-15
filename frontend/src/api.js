const API_BASE = "http://localhost:8000/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "content-type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const getDashboard = (source = "mashala") => apiFetch(`/dashboard/${source}`);
export const getSalesChart = (source = "mashala", days = 30) => apiFetch(`/sales-chart/${source}?days=${days}`);
export const getProducts = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/products/${source}?${q}`);
};
export const getProduct = (source, id) => apiFetch(`/products/${source}/${id}`);
export const getSales = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/sales/${source}?${q}`);
};
export const getPurchases = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/purchases/${source}?${q}`);
};
export const getCustomers = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/customers/${source}?${q}`);
};
export const getVendors = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/vendors/${source}?${q}`);
};
export const getEmployees = (source) => apiFetch(`/employees/${source}`);
export const getExpired = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/expired/${source}?${q}`);
};
export const getAccounts = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/accounts/${source}?${q}`);
};
export const getShortcoming = (source) => apiFetch(`/shortcoming/${source}`);
export const getStores = (source) => apiFetch(`/stores/${source}`);
export const getCashDisk = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/cash-disk/${source}?${q}`);
};
export const getHealth = () => apiFetch("/health");
