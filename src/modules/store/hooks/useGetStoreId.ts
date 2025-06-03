import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { store } from '../api/store';
import { storeAdapter } from '../libs/storeAdapter';

export const useGetStoreId = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stores-id', id],
    queryFn: () => store.getId(id),
    select: (res) => storeAdapter(get(res, 'data')),
  });

  return { data, isLoading, error };
};
