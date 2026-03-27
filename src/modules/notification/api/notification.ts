import { IFilterProps } from 'src/modules/package/types/Filter';

import { delay, fakeRes, MOCK_NOTIFICATIONS } from 'src/_mock/fake-backend';

import { NotificationFormType } from '../libs/notificationScheme';

export const notification = {
  getAll: async (_params: IFilterProps) => {
    await delay();
    return { data: MOCK_NOTIFICATIONS } as any;
  },
  send: async (_data: NotificationFormType) => {
    await delay();
    return fakeRes({ success: true });
  },
  delete: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  update: async (_id: string, _data: NotificationFormType) => {
    await delay();
    return fakeRes({ success: true });
  },
};
