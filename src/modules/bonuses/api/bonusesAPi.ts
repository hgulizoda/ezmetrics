import { delay, fakeRes, paginated, MOCK_ORDERS, MOCK_BONUSES, MOCK_BONUS_LIMIT } from 'src/_mock/fake-backend';

import { IFilters } from '../types/Filters';
import { IUpdateLimit } from '../types/Limit';

interface Props {
  id: string;
  params: {
    page: number;
    limit: number;
  };
}

export const bonusesAPI = {
  getAll: async (params: IFilters) => {
    await delay();
    const searched = params.search
      ? MOCK_BONUSES.filter((b) =>
          `${b.profile.first_name} ${b.profile.last_name}`.toLowerCase().includes(params.search!.toLowerCase())
        )
      : MOCK_BONUSES;
    return paginated(searched, params.page, params.limit) as any;
  },
  getUserBonuses: async (id: string) => {
    await delay();
    const items = MOCK_BONUSES.filter((b) => b.user._id === id);
    return { data: items } as any;
  },
  getOne: async (id: string) => {
    await delay();
    const bonus = MOCK_BONUSES.find((b) => b._id === id) || MOCK_BONUSES[0];
    return fakeRes({ data: bonus });
  },
  updateStatus: async (_bonus_id: string, _user_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  unUseBonus: async (_bonus_id: string, _user_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  getLimit: async () => {
    await delay();
    return MOCK_BONUS_LIMIT;
  },
  changeLimit: async (_limit: IUpdateLimit) => {
    await delay();
    return fakeRes({ success: true });
  },
  getSingleUserBonus: async ({ id: _id, params }: Props) => {
    await delay();
    const items = MOCK_ORDERS.slice(0, 5);
    return paginated(items, params.page, params.limit);
  },
  removeOrderBall: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  getRemovedBalls: async ({ id: _id, params }: Props) => {
    await delay();
    return paginated(MOCK_ORDERS.slice(0, 2), params.page, params.limit);
  },
  restoreBall: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};
