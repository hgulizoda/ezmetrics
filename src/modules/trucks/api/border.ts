import axiosInstance from '../../../utils/axios';
import { ITruckRes } from '../types/ChinaBorder';
import { IApiResponse } from '../../../types/ApiRes';
import { SendTransitType } from '../libs/sendTransit';
import { IFilterProps } from '../../package/types/Filter';
import { SeparateFormType } from '../libs/separateScheme';

export const chinaborderTruck = {
  get: (params: IFilterProps, status: string) =>
    axiosInstance
      .get<IApiResponse<ITruckRes>>(`orders/by-truck?status=${status}`, { params })
      .then((response) => response.data),
};

export const truckPackage = {
  separate: (value: SeparateFormType, id: string) =>
    axiosInstance.post(`orders/${id}/partial-order`, value).then((response) => response),
  takeDown: (truckID: string, id: string) =>
    axiosInstance.put(`orders/${truckID}/remove-order/${id}`).then((res) => res),
};

export const sendTrucktoNextStep = {
  send: (truckID: string, status: string, value?: SendTransitType) =>
    axiosInstance
      .put(`orders/${truckID}/order_status/${status}`, value)
      .then((response) => response),

  back: (truckID: string, status: string) =>
    axiosInstance.put(`orders/${truckID}/order_status/${status}`).then((response) => response),
};
