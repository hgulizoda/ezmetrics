import { delay, fakeRes, MOCK_TRUCK_ORDERS, paginated } from 'src/_mock/fake-backend';

import { IFilterProps } from '../../package/types/Filter';
import { SendTransitType } from '../libs/sendTransit';
import { SeparateFormType } from '../libs/separateScheme';

export const chinaborderTruck = {
  get: async (params: IFilterProps, _status: string) => {
    await delay();
    return paginated(MOCK_TRUCK_ORDERS, params.page, params.limit) as any;
  },
};

export const truckPackage = {
  separate: async (_value: SeparateFormType, _id: string) => {
    await delay();
    return fakeRes({ success: true, _id: `ord_sep_${Date.now()}` });
  },
  takeDown: async (_truckID: string, _id: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};

export const sendTrucktoNextStep = {
  send: async (_truckID: string, _status: string, _value?: SendTransitType) => {
    await delay();
    return fakeRes({ success: true });
  },
  back: async (_truckID: string, _status: string) => {
    await delay();
    return fakeRes({ success: true });
  },
};
