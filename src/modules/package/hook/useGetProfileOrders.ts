import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { IFilterProps } from '../types/Filter';
import { profileOrders } from '../api/packageApis';
import { getProfileOrdersAdapter } from '../libs/userProfileOrdersAdapter';

export const useGetProfileOrders = (
  id: string,
  status: string | undefined,
  params?: IFilterProps
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profileOrders', id, status, params?.page, params?.limit, params?.search],
    queryFn: () => profileOrders.getAll(id, status, params),
    enabled: !!id && id.trim() !== '',
    select: (res) => ({
      orders: getProfileOrdersAdapter(get(res, 'data', [])),
      totals: get(res, 'totals'),
      pagination: get(res, 'pagination'),
    }),
  });

  return {
    profileOrders: data?.orders,
    totals: data?.totals,
    pagination: data?.pagination,
    isLoading,
    error,
  };
};
