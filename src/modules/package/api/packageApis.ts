import { delay, fakeRes, paginated, MOCK_ORDERS } from 'src/_mock/fake-backend';

import { IFilterProps } from '../types/Filter';
import { CreatePackageFormType } from '../libs/createPackageScheme';
import { IChinaBorderUpdate } from '../types/ResiduePackage';

// All packages
export const allPackages = {
  getAll: async (params: IFilterProps) => {
    await delay();
    const filtered = params.status
      ? MOCK_ORDERS.filter((o) => o.status === params.status)
      : MOCK_ORDERS;
    const searched = params.search
      ? filtered.filter((o) => o.order_id.toLowerCase().includes(params.search!.toLowerCase()))
      : filtered;
    return paginated(searched, params.page, params.limit) as any;
  },
};

// New package
export const newPackage = {
  create: async (value: CreatePackageFormType) => {
    await delay();
    return fakeRes({ _id: `ord_new_${Date.now()}`, ...value, status: 'pending', order_id: `GM${Date.now()}` });
  },
};

// China warehouse
export const chinaWarehouse = {
  getAll: async (params: IFilterProps) => {
    await delay();
    const items = MOCK_ORDERS.filter((o) => o.status === 'in_china_warehouse');
    return paginated(items, params.page, params.limit) as any;
  },
  updateStatus: async (_id: string, _userId: string, _data: IChinaBorderUpdate) => {
    await delay();
    return fakeRes({ success: true });
  },
};

// User profile orders
export const profileOrders = {
  getAll: async (id: string, status: string | undefined, params?: IFilterProps) => {
    await delay();
    let items = MOCK_ORDERS.filter((o) => o.user._id === id);
    if (status && status.trim()) items = items.filter((o) => o.status === status);
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return {
      ...paginated(items, page, limit),
      totals: {
        total_weight: items.reduce((sum, o) => sum + o.order_weight, 0),
        total_capacity: items.reduce((sum, o) => sum + o.order_capacity, 0),
        total_counts: items.reduce((sum, o) => sum + o.total_count, 0),
        total_places: items.reduce((sum, o) => sum + o.total_places, 0),
      },
    } as any;
  },
};

// Single order
export const singleOrder = {
  get: async (id: string) => {
    await delay();
    const order = MOCK_ORDERS.find((o) => o._id === id) || MOCK_ORDERS[0];
    return { data: order } as any;
  },
  update: async (_value: CreatePackageFormType, _id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  goBack: async (_id: string | undefined, _userID: string | undefined, _status: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  archive: async (_id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};

// Collect package
export const collectPackage = {
  add: async (_id: string, _truckID: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};

// Without truck packages
export const witoutTruckPackages = {
  getAll: async (params: IFilterProps) => {
    await delay();
    const items = MOCK_ORDERS.filter((o) => !o.truck);
    return paginated(items, params.page, params.limit) as any;
  },
  delivered: async (_id: string, _userID: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};
