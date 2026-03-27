import { delay, fakeRes, paginated, MOCK_USERS } from 'src/_mock/fake-backend';

import { IFilterProps } from '../../package/types/Filter';

const archivedUsers = MOCK_USERS.slice(0, 2).map((u) => ({ ...u, status: 'archived', is_deleted: true }));

export const users = {
  get: async (params: IFilterProps) => {
    await delay();
    return paginated(archivedUsers, params.page, params.limit) as any;
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
