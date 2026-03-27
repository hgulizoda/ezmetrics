import { delay, fakeRes, paginated, MOCK_ORDERS } from 'src/_mock/fake-backend';

import { IFilterProps } from '../../package/types/Filter';

const archivedOrders = MOCK_ORDERS.slice(0, 3).map((o) => ({ ...o, status: 'archived' }));

export const packages = {
  get: async (params: IFilterProps) => {
    await delay();
    return paginated(archivedOrders, params.page, params.limit) as any;
  },
  delete: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  unarchive: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};
