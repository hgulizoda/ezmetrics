import { IFilterProps } from 'src/modules/package/types/Filter';

import axiosInstance from '../../../utils/axios';
import { INotificationRes } from '../types/Notification';
import { NotificationFormType } from '../libs/notificationScheme';

export const notification = {
  getAll: (params: IFilterProps) =>
    axiosInstance
      .get<{ data: INotificationRes[] }>(`/notification/all`, { params })
      .then((res) => res.data),
  send: (data: NotificationFormType) =>
    axiosInstance.post(`/notification/send`, data).then((res) => res),
  delete: (id: string) => axiosInstance.delete(`/notification/${id}`).then((res) => res),
  update: (id: string, data: NotificationFormType) =>
    axiosInstance.put(`/notification/${id}`, data).then((res) => res),
};
