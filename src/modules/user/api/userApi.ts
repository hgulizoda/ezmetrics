import axiosInstance from 'src/utils/axios';

import { IApiResponse } from 'src/types/ApiRes';

import { IUserRes } from '../types/User';
import { IProfileMeRes } from '../types/Profile';
import { UserFormType } from '../libs/userScheme';
import { IFilterProps } from '../../package/types/Filter';
import { UserFormTypeRequired } from '../libs/useSchemeRequired';

export const user = {
  getAll: (params?: IFilterProps) =>
    axiosInstance.get<IApiResponse<IUserRes>>('users', { params }).then((res) => res.data),
  updateStatus: async (id: string, status: string) =>
    axiosInstance.put(`users/${id}/${status}`).then((res) => res),
  create: (values: UserFormTypeRequired) =>
    axiosInstance.post(`users`, values).then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`users/soft-delete/${id}`).then((res) => res.data),
};

export const profile = {
  getProfile: (id: string) =>
    axiosInstance.get<{ data: IProfileMeRes }>(`profile/${id}`).then((res) => res.data),
  updateProfile: (id: string, data: UserFormType) =>
    axiosInstance.put(`users/${id}`, data).then((res) => res.data),
};
