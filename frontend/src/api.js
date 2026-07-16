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
export const createStore = (source, data) => 
  apiFetch(`/stores/${source}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
export const updateStore = (source, id, data) => 
  apiFetch(`/stores/${source}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
export const deleteStore = (source, id) => 
  apiFetch(`/stores/${source}/${id}`, {
    method: 'DELETE'
  });
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

export const getPartners = (source, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/partners/${source}?${q}`);
};
export const createPartner = (source, data) => 
  apiFetch(`/partners/${source}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
export const updatePartner = (source, id, data) => 
  apiFetch(`/partners/${source}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const getDividends = (source) => apiFetch(`/dividends/${source}`);
export const getTransfers = () => apiFetch(`/transfers`);

export const getHealth = () => apiFetch("/health");

export const getOrders = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/orders/);
  return response.json();
};

export const getBranchOrders = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/branch-orders/);
  return response.json();
};

export const getTreasury = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/treasury/);
  return response.json();
};

export const getBanks = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/banks/);
  return response.json();
};

export const getEmployees = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/employees/);
  return response.json();
};

export const getSalaries = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/salaries/);
  return response.json();
};

export const getTuningAccounts = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/tuning/);
  return response.json();
};

export const getAccountTree = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/account-tree/);
  return response.json();
};

export const getGedoFinancial = async (source = 'elsanta') => {
  const response = await fetch(${API_URL}/gedo-financial/);
  return response.json();
};
