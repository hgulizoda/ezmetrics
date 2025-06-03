import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { chinaborderTruck } from '../api/border';
import { chinaBorderAdapter } from '../libs/border';
import { IFilterProps } from '../../package/types/Filter';

export const useGetTrucks = (params: IFilterProps, status: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['truckDetails', params],
    queryFn: () => chinaborderTruck.get(params, status),
    select: (res) => ({
      trucks: chinaBorderAdapter(get(res, 'data.with_truck', [])),
      pagination: get(res, 'pagination'),
    }),
  });

  return { isLoading, error, data };
};
