const API_BASE = "/api";

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

export const getOrders = (source = 'elsanta') => apiFetch(`/orders/${source}`);
export const getBranchOrders = (source = 'elsanta') => apiFetch(`/branch-orders/${source}`);
export const getTreasury = (source = 'elsanta') => apiFetch(`/treasury/${source}`);
export const getBanks = (source = 'elsanta') => apiFetch(`/banks/${source}`);
export const getSalaries = (source = 'elsanta') => apiFetch(`/salaries/${source}`);
export const getTuningAccounts = (source = 'elsanta') => apiFetch(`/tuning/${source}`);
export const getAccountTree = (source = 'elsanta') => apiFetch(`/account-tree/${source}`);
export const getGedoFinancial = (source = 'elsanta') => apiFetch(`/gedo-financial/${source}`);
export const getExpiredProducts = (source = 'elsanta') => apiFetch(`/reports/expired/${source}`);

export const getStartStock = (source = 'elsanta') => apiFetch(`/start-stock/${source}`);
export const getInventory = (source = 'elsanta') => apiFetch(`/inventory/${source}`);
export const getPurchaseReturns = (source = 'elsanta') => apiFetch(`/purchase-returns/${source}`);
export const getSalesReturns = (source = 'elsanta') => apiFetch(`/sales-returns/${source}`);
export const getSalesPending = (source = 'elsanta') => apiFetch(`/sales-pending/${source}`);
export const getVendorBalances = (source = 'elsanta') => apiFetch(`/vendor-balances/${source}`);
export const getBranchTransfers = (source = 'elsanta') => apiFetch(`/branch-transfers/${source}`);
export const getSalesGeneral = (source = 'elsanta') => apiFetch(`/reports/sales-general/${source}`);
export const getSalesProfit = (source = 'elsanta') => apiFetch(`/reports/sales-profit/${source}`);
export const getSalesEmployee = (source = 'elsanta') => apiFetch(`/reports/sales-employee/${source}`);
export const getBankStatement = (source = 'elsanta') => apiFetch(`/reports/bank-statement/${source}`);
export const getCashClose = (source = 'elsanta') => apiFetch(`/reports/cash-close/${source}`);
export const runBackup = (source = 'elsanta') => apiFetch(/backup/, { method: 'POST' });
