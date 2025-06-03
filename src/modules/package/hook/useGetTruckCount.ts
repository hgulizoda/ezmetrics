import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { getTruckCount } from '../api/packagesCount';

export const useGetTruckCount = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['truckCount'],
    queryFn: getTruckCount,
    select: (res) => get(res, 'data'),
  });

  return { data, isLoading, error };
};
