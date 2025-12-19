import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { truckDetails } from '../api/truckDetails';
import { IFilterProps } from '../../package/types/Filter';
import { truckDetailsAdapter } from '../libs/truckDetailsAdapter';
import { getProfileOrder } from '../../package/libs/userProfileOrdersAdapter';

interface IProps {
  id: string;
  params: IFilterProps;
}

export const useGetTruckDetails = ({ id, params }: IProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['truckDetails', params],
    queryFn: () => truckDetails.getOrder({ id, params }),
    select: (res) => ({
      orders: truckDetailsAdapter(get(res, 'data.orders', [])),
      average_weight: get(res, 'data.average_weight', 0),
      name: get(res, 'data.name'),
      totals: get(res, 'data.totals') as any,
      createdAt: get(res, 'data.created_at', '--'),
      estimatedArrivalDate: get(res, 'data.estimated_arrival_date', '--'),
      containerNumber: get(res, 'data.container_number', '--'),
      status: get(res, 'data.status'),
    }),
  });

  return { data, isLoading, error };
};

export const useGetTruckDetailsOrders = ({ id, params }: IProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['truckDetails', params],
    queryFn: () => truckDetails.getTruckOrder({ id, params }),
    select: (res) => ({
      orders: truckDetailsAdapter(get(res, 'data.orders', [])),
      name: get(res, 'data.name'),
      totals: get(res, 'data.totals') as any,
      average_weight: get(res, 'data.average_weight', 0),
      containerNumber: get(res, 'data.container_number', '--'),
      arrivalDate: get(res, 'data.estimated_arrival_date', '--'),
      createdAt: get(res, 'data.created_at', ''),
      status: get(res, 'data.status', '--'),
    }),
  });

  return { data, isLoading, error };
};

export const useGetTruckOrder = (id: string | number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['truckOrder', id],
    queryFn: () => truckDetails.getOrderById(id),
    select: (res) => getProfileOrder(get(res, 'data')),
  });

  return { data, isLoading, error };
};
