import { delay, MOCK_BANNERS } from 'src/_mock/fake-backend';

import { IBannerPost } from '../types/banner';

export const banner = {
  create: async (data: IBannerPost) => {
    await delay();
    return { _id: `b_new_${Date.now()}`, ...data, order: MOCK_BANNERS.length + 1 };
  },
  get: async () => {
    await delay();
    return { data: MOCK_BANNERS } as any;
  },
  reOrder: async (_data: { id: string; order: number }) => {
    await delay();
    return { success: true };
  },
  delete: async (_id: string) => {
    await delay();
    return { success: true };
  },
};
