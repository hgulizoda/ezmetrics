import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { IFilterProps } from 'src/modules/package/types/Filter';
import { truckDetailsAdapter } from 'src/modules/settings/libs/truckDetailsAdapter';

import { transport } from '../api/transport';

interface Props {
  id: string;
  params: IFilterProps;
}

export const useGetArchiedTruckOrders = ({ id, params }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['archived-truck-orders', params],
    queryFn: () => transport.packages(id, params),
    select: (res) => ({
      orders: truckDetailsAdapter(get(res, 'data.orders', [])),
      name: get(res, 'data.name'),
    }),
  });

  return { data, isLoading, error };
};
