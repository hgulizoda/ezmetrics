import axiosInstance from 'src/utils/axios';

import { IApiResponse } from 'src/types/ApiRes';

import { IStatRes, UsersResponse } from '../types/Stats';
import { IUserProfileRes } from '../../package/types/UserProfileOrders';

export const statistics = {
  get: (params: { page: number; limit: number; search: string }) =>
    axiosInstance
      .get<{ data: UsersResponse }>(`/statistics/users/all`, { params })
      .then((res) => res.data),
  getUser: (id: string) =>
    axiosInstance.get<{ data: IStatRes }>(`/statistics/users/${id}`).then((res) => res.data),
  getUserOrders: (
    userId: string,
    params: { page: number; limit: number; status?: string; search?: string }
  ) =>
    axiosInstance
      .get<
        IApiResponse<IUserProfileRes> & {
          totals?: {
            total_weight: number;
            total_capacity: number;
            total_counts: number;
            total_places: number;
          };
        }
      >(`/orders/user/${userId}/orders`, { params })
      .then((res) => res.data),
};
