import { INotification, INotificationRes } from '../types/Notification';

const getNotifications = (item: INotificationRes): INotification => ({
  title: {
    uz: item.title?.uz ?? '',
    ru: item.title?.ru ?? '',
  },
  body: {
    uz: item.body?.uz ?? '',
    ru: item.body?.ru ?? '',
  },
  id: item?._id ?? '',
  image: {
    uz: item?.image.uz ?? '',
    ru: item?.image.ru ?? '',
  },
  sendedDate: item?.date ?? '',
  updatedDate: item?.updated_at ?? '',
});

export const notificationAdapter = (notification: INotificationRes[]) =>
  notification?.map(getNotifications) || [];
