import axiosInstance from '../../../utils/axios';
import { IApiResponse } from '../../../types/ApiRes';
import { IFilterProps } from '../../package/types/Filter';
import { IAllPackagesRes } from '../../package/types/AllPackages';

export const packages = {
  get: (params: IFilterProps) =>
    axiosInstance
      .get<IApiResponse<IAllPackagesRes>>('orders/archived', { params })
      .then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`orders/${id}`).then((res) => res),
  unarchive: (id: string) => axiosInstance.put(`orders/${id}/unarchive`).then((res) => res),
};
