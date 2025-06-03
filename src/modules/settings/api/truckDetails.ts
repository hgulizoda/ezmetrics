import axiosInstance from '../../../utils/axios';
import { IFilterProps } from '../../package/types/Filter';
import { ITruckDetailsResponse } from '../types/truckDetails';
import { IUserProfileRes } from '../../package/types/UserProfileOrders';

interface IProps {
  id: string;
  params: IFilterProps;
}

export const truckDetails = {
  getOrder: ({ id, params }: IProps) =>
    axiosInstance
      .get<{
        data: ITruckDetailsResponse;
      }>(`truck/${id}`, { params })
      .then((response) => response.data),
  getTruckOrder: ({ id, params }: IProps) =>
    axiosInstance
      .get<{
        data: ITruckDetailsResponse;
      }>(`truck/${id}/orders`, { params })
      .then((response) => response.data),
  getOrderById: (id: string | number) =>
    axiosInstance
      .get<{
        data: IUserProfileRes;
      }>(`orders/${id}`)
      .then((response) => response.data),
};
