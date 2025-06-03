import axiosInstance from 'src/utils/axios';

import { StoreRes } from '../types/Store';
import { CreateStoreSchemaType } from '../libs/createStoreScheme';

export const store = {
  create: (values: CreateStoreSchemaType) =>
    axiosInstance.post('store-info', values).then((res) => res),
  update: (values: CreateStoreSchemaType, id: string) =>
    axiosInstance.put(`store-info/${id}`, values).then((res) => res),
  get: () => axiosInstance.get<{ data: StoreRes[] }>('store-info/all').then((res) => res.data),
  getId: (id: string) =>
    axiosInstance.get<{ data: StoreRes }>(`store-info/${id}`).then((res) => res.data),
  delete: (id: string) =>
    axiosInstance.delete<{ data: StoreRes }>(`store-info/${id}`).then((res) => res.data),
};
