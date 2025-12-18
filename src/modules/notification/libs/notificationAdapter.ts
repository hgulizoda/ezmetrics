import { INotification, INotificationRes } from '../types/Notification';

const getNotifications = (item: INotificationRes): INotification => ({
  title: {
    uz: item.title?.uz ?? '',
    ru: item.title?.ru ?? '',
    en: item.title?.en ?? '',
  },
  body: {
    uz: item.body?.uz ?? '',
    ru: item.body?.ru ?? '',
    en: item.body?.en ?? '',
  },
  id: item?._id ?? '',
  image: {
    uz: item?.image.uz ?? '',
    ru: item?.image.ru ?? '',
    en: item?.image.en ?? '',
  },
  sendedDate: item?.date ?? '',
  updatedDate: item?.updated_at ?? '',
});

export const notificationAdapter = (notification: INotificationRes[]) =>
  notification?.map(getNotifications) || [];
