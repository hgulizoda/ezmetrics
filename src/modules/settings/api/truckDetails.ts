import { delay, MOCK_TRUCKS, MOCK_ORDERS } from 'src/_mock/fake-backend';

import { IFilterProps } from '../../package/types/Filter';

interface IProps {
  id: string;
  params: IFilterProps;
}

export const truckDetails = {
  getOrder: async ({ id, params: _params }: IProps) => {
    await delay();
    const truck = MOCK_TRUCKS.find((t) => t._id === id) || MOCK_TRUCKS[0];
    return {
      data: {
        ...truck,
        orders: MOCK_ORDERS.filter((o) => o.truck?._id === id).slice(0, 5),
      },
    } as any;
  },
  getTruckOrder: async ({ id, params: _params }: IProps) => {
    await delay();
    const truck = MOCK_TRUCKS.find((t) => t._id === id) || MOCK_TRUCKS[0];
    return {
      data: {
        ...truck,
        orders: MOCK_ORDERS.filter((o) => o.truck?._id === id).slice(0, 5),
      },
    } as any;
  },
  getOrderById: async (id: string | number) => {
    await delay();
    const order = MOCK_ORDERS.find((o) => o._id === String(id)) || MOCK_ORDERS[0];
    return { data: order } as any;
  },
};
