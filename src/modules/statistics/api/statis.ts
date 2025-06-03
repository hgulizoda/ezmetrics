import axiosInstance from 'src/utils/axios';

import { UsersResponse } from '../types/Stats';

export const statistics = {
  get: (params: { page: number; limit: number; search: string }) =>
    axiosInstance
      .get<{ data: UsersResponse }>(`/statistics/users/all`, { params })
      .then((res) => res.data),
};
