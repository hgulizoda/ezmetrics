import { delay, fakeRes, MOCK_STORES } from 'src/_mock/fake-backend';

import { CreateStoreSchemaType } from '../libs/createStoreScheme';

export const store = {
  create: async (values: CreateStoreSchemaType) => {
    await delay();
    return fakeRes({ _id: `s_new_${Date.now()}`, ...values });
  },
  update: async (_values: CreateStoreSchemaType, _id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  get: async () => {
    await delay();
    return { data: MOCK_STORES } as any;
  },
  getId: async (id: string) => {
    await delay();
    const item = MOCK_STORES.find((s) => s._id === id) || MOCK_STORES[0];
    return { data: item } as any;
  },
  delete: async (_id: string) => {
    await delay();
    return { data: { success: true } } as any;
  },
};
