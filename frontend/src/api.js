const API_BASE = "http://localhost:8001/api";

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
export const createVendor = (source, data) => 
  apiFetch(`/vendors/${source}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
export const updateVendor = (source, id, data) => 
  apiFetch(`/vendors/${source}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
export const deleteVendor = (source, id) => 
  apiFetch(`/vendors/${source}/${id}`, {
    method: 'DELETE'
  });
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
export const getCompany = (source) => apiFetch(`/company/${source}`);
export const getBranches = () => apiFetch(`/branches`);
export const getGroups = (source) => apiFetch(`/groups/${source}`);
export const getUnits = (source) => apiFetch(`/units/${source}`);


export const createCustomer = (source, data) => 
  apiFetch(`/customers/${source}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const updateCustomer = (source, id, data) => 
  apiFetch(`/customers/${source}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const deleteCustomer = (source, id) => 
  apiFetch(`/customers/${source}/${id}`, {
    method: 'DELETE'
  });
export const getManufacturers = (source, search = '') => apiFetch(`/companies/${source}?search=${encodeURIComponent(search)}`);
export const getHealth = () => apiFetch("/health");
