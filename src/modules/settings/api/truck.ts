import axiosInstance from 'src/utils/axios';

import { IApiResponse } from 'src/types/ApiRes';

import { ITruck, ITruckRes } from '../types/truck';
import { IFilterProps } from '../../package/types/Filter';

export const truck = {
  create: (values: {
    name: string;
    created_at: Date;
    estimated_arrival_date: Date;
    container_number?: string;
  }) => axiosInstance.post('truck', values).then((res) => res),
  getAll: (params?: IFilterProps) =>
    axiosInstance.get<IApiResponse<ITruckRes>>('truck', { params }).then((res) => res.data),
  update: (values: { name: string; created_at: string | Date }, id: string) =>
    axiosInstance.put<ITruck>(`truck/${id}`, values).then((res) => res),
  delete: (id: string) => axiosInstance.delete(`truck/${id}`).then((res) => res),
  archive: (id: string) => axiosInstance.put(`truck/${id}/archive`).then((res) => res),
};
