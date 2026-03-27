import { delay, fakeRes, MOCK_PRICES } from 'src/_mock/fake-backend';
import { IFilterProps } from 'src/modules/package/types/Filter';

import { PriceSchemeType } from '../libs/priceScheme';

export const price = {
  get: async (_params: IFilterProps) => {
    await delay();
    return { data: MOCK_PRICES } as any;
  },
  delete: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  getById: async (id: string) => {
    await delay();
    const item = MOCK_PRICES.find((p) => p._id === id) || MOCK_PRICES[0];
    return { data: item } as any;
  },
  update: async (_value: PriceSchemeType, _id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  create: async (values: PriceSchemeType) => {
    await delay();
    return fakeRes({ _id: `pr_new_${Date.now()}`, ...values });
  },
};
