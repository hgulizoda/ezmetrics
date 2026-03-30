import { IFilterProps } from 'src/modules/package/types/Filter';

import { IPriceRes } from '../types/Price';
import axiosInstance from '../../../utils/axios';
import { PriceSchemeType } from '../libs/priceScheme';

export const price = {
  get: (params: IFilterProps) =>
    axiosInstance.get<{ data: IPriceRes[] }>('calculator', { params }).then((res) => res.data),
  delete: (id: string) => axiosInstance.delete(`calculator/${id}`).then((res) => res),
  getById: (id: string) =>
    axiosInstance.get<{ data: IPriceRes }>(`calculator/${id}`).then((res) => res.data),
  update: (value: PriceSchemeType, id: string) =>
    axiosInstance.put(`calculator/${id}`, value).then((res) => res),
  create: (values: PriceSchemeType) => axiosInstance.post('calculator', values),
};
