import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { store } from '../api/store';
import { storeMapper } from '../libs/storeAdapter';

export const useGetStore = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: store.get,
    select: (res) => storeMapper(get(res, 'data', [])),
  });

  return { data, isLoading, error };
};
