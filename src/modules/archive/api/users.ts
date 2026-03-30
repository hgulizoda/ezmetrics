import axiosInstance from '../../../utils/axios';
import { IUserRes } from '../../user/types/User';
import { IApiResponse } from '../../../types/ApiRes';
import { IFilterProps } from '../../package/types/Filter';

export const users = {
  get: (params: IFilterProps) =>
    axiosInstance.get<IApiResponse<IUserRes>>('users/archived', { params }).then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`users/hard-delete/${id}`).then((res) => res),
  unarchive: (id: string) => axiosInstance.delete(`users/unarchive/${id}`).then((res) => res),
};
