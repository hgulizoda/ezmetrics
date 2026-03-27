import { delay, fakeRes, paginated, MOCK_TRUCKS } from 'src/_mock/fake-backend';

import { IFilterProps } from '../../package/types/Filter';

export const truck = {
  create: async (values: {
    name: string;
    created_at: Date;
    estimated_arrival_date: Date;
    container_number?: string;
  }) => {
    await delay();
    return fakeRes({ _id: `t_new_${Date.now()}`, ...values });
  },
  getAll: async (params?: IFilterProps) => {
    await delay();
    return paginated(MOCK_TRUCKS, params?.page, params?.limit) as any;
  },
  update: async (values: { name: string; created_at: string | Date }, id: string) => {
    await delay();
    return fakeRes({ _id: id, ...values });
  },
  delete: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  archive: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};
