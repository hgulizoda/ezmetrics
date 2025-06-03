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
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/admin/me',
    login: '/auth/admin/signin',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
