import axios, { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';

// ----------------------------------------------------------------------

const commonAxiosOptions: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  timeout: 30000,
};

export const uninterceptedAxiosInstance = axios.create(commonAxiosOptions);

const axiosInstance = axios.create(commonAxiosOptions);
const STORAGE_KEY = 'accessToken';
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEY);
    const newConfig = config;

    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   localStorage.removeItem('token');
    //   window.location.href = '/auth/login';
    // }
    throw error;
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
  workers: {
    list: '/workers',
    detail: (id: string) => `/workers/${id}`,
    status: '/workers/status',
  },
  clock: {
    in: '/clock/in',
    out: '/clock/out',
    records: '/clock/records',
    detail: (id: string) => `/clock/${id}`,
    export: '/clock/export',
  },
  shifts: {
    list: '/shifts',
    detail: (id: string) => `/shifts/${id}`,
  },
  efficiency: {
    list: '/efficiency',
    history: '/efficiency/history',
  },
  bonusRules: {
    list: '/bonus-rules',
    detail: (id: string) => `/bonus-rules/${id}`,
  },
  salary: {
    records: '/salary',
    detail: (id: string) => `/salary/${id}`,
    rules: '/salary/rates',
    override: (id: string) => `/salary/${id}/override`,
  },
  loans: {
    list: '/loans',
    detail: (id: string) => `/loans/${id}`,
  },
  reports: {
    totals: '/reports/salary-totals',
    worker: (id: string) => `/reports/worker/${id}`,
    trends: '/reports/trends',
    export: '/reports/export',
    filter: '/reports',
  },
  dashboard: {
    summary: '/dashboard/summary',
  },
  settings: {
    list: '/admin/settings',
    detail: (key: string) => `/admin/settings/${key}`,
  },
  // Legacy endpoints (backward compatibility)
  chat: '/chat',
  post: {
    list: '/posts',
    details: '/posts',
    latest: '/posts/latest',
    search: '/posts/search',
  },
};
