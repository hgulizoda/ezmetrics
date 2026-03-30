import { ITruckDetailsResponse } from 'src/modules/settings/types/truckDetails';

import axiosInstance from '../../../utils/axios';
import { TransportRes } from '../types/Transport';
import { IApiResponse } from '../../../types/ApiRes';
import { IFilterProps } from '../../package/types/Filter';

export const transport = {
  get: (params: IFilterProps) =>
    axiosInstance
      .get<IApiResponse<TransportRes>>('truck/archived', { params })
      .then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`truck/${id}`).then((res) => res),
  packages: (id: string, params: IFilterProps) =>
    axiosInstance
      .get<{ data: ITruckDetailsResponse }>(`truck/${id}/archived`, { params })
      .then((res) => res.data),
  unarchive: (id: string) => axiosInstance.put(`truck/${id}/unarchive`).then((res) => res),
};
