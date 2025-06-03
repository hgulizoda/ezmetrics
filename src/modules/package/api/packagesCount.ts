import axiosInstance from 'src/utils/axios';

import { ICount } from 'src/types/count';

import { IProfileOrderCount } from '../types/UserOrderCount';

export const getTableCount = () =>
  axiosInstance.get<ICount>('orders/count').then((res) => res.data);

export const getTruckCount = () => axiosInstance.get('truck/counts').then((res) => res.data);

export const getUserOrderCount = (id: string) =>
  axiosInstance.get<{ data: IProfileOrderCount }>(`orders/count/${id}`).then((res) => res.data);
