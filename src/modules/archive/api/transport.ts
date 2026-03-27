import { delay, fakeRes, paginated, MOCK_TRUCKS, MOCK_ORDERS } from 'src/_mock/fake-backend';

import { IFilterProps } from '../../package/types/Filter';

const archivedTrucks = MOCK_TRUCKS.slice(0, 1).map((t) => ({ ...t, status: 'archived' }));

export const transport = {
  get: async (params: IFilterProps) => {
    await delay();
    return paginated(archivedTrucks, params.page, params.limit) as any;
  },
  delete: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  packages: async (_id: string, _params: IFilterProps) => {
    await delay();
    const truck = MOCK_TRUCKS.find((t) => t._id === _id) || MOCK_TRUCKS[0];
    return {
      data: {
        ...truck,
        orders: MOCK_ORDERS.slice(0, 3),
      },
    } as any;
  },
  unarchive: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};
