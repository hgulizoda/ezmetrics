import { delay, MOCK_ORDERS, MOCK_STATISTICS_USERS, MOCK_USER_STATS, paginated } from 'src/_mock/fake-backend';

export const statistics = {
  get: async (params: { page: number; limit: number; search: string }) => {
    await delay();
    let { users } = MOCK_STATISTICS_USERS;
    if (params.search) {
      users = users.filter((u) =>
        `${u.profile.first_name} ${u.profile.last_name}`.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    return {
      data: {
        users: users.slice((params.page - 1) * params.limit, params.page * params.limit),
        pagination: { ...MOCK_STATISTICS_USERS.pagination, current_page: params.page },
        totals: MOCK_STATISTICS_USERS.totals,
      },
    } as any;
  },
  getUser: async (id: string) => {
    await delay();
    return { data: MOCK_USER_STATS(id) } as any;
  },
  getUserOrders: async (
    userId: string,
    params: { page: number; limit: number; status?: string; search?: string }
  ) => {
    await delay();
    let items = MOCK_ORDERS.filter((o) => o.user._id === userId);
    if (params.status) items = items.filter((o) => o.status === params.status);
    return {
      ...paginated(items, params.page, params.limit),
      totals: {
        total_weight: items.reduce((s, o) => s + o.order_weight, 0),
        total_capacity: items.reduce((s, o) => s + o.order_capacity, 0),
        total_counts: items.reduce((s, o) => s + o.total_count, 0),
        total_places: items.reduce((s, o) => s + o.total_places, 0),
      },
    } as any;
  },
};
