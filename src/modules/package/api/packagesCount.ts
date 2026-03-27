import { delay, MOCK_ORDERS, MOCK_ORDER_COUNTS } from 'src/_mock/fake-backend';

export const getTableCount = async () => {
  await delay();
  return MOCK_ORDER_COUNTS;
};

export const getTruckCount = async () => {
  await delay();
  return {
    data: {
      active: 2,
      archived: 1,
      total: 3,
      to_china_border: 0,
      in_transit: 0,
      to_uzb_customs: 0,
      in_customs: 0,
      delivered: 0,
    },
  };
};

export const getUserOrderCount = async (id: string) => {
  await delay();
  const userOrders = MOCK_ORDERS.filter((o) => o.user._id === id);
  return {
    data: {
      total: userOrders.length,
      active: userOrders.filter((o) => o.status !== 'delivered').length,
      delivered: userOrders.filter((o) => o.status === 'delivered').length,
    },
  };
};
