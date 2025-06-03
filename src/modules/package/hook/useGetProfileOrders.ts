import { get } from 'lodash';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { profileOrders } from '../api/packageApis';
import { getProfileOrdersAdapter } from '../libs/userProfileOrdersAdapter';

export const useGetProfileOrders = (id: string, status: string) => {
  const params = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['profileOrders', params],
    queryFn: () => profileOrders.getAll(id, status),
    select: (res) => getProfileOrdersAdapter(get(res, 'data', [])),
  });
  return {
    profileOrders: data,
    isLoading,
    error,
  };
};
