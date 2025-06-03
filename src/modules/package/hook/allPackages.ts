import get from 'lodash/get';
import { useQuery } from '@tanstack/react-query';

import { IApiResponse } from 'src/types/ApiRes';

import { IFilterProps } from '../types/Filter';
import { allPackages } from '../api/packageApis';
import { IAllPackagesRes } from '../types/AllPackages';
import { getAllPackagesAdapter } from '../libs/allPackagesAdapter';

export const useGetAllPackages = (params: IFilterProps) => {
  const initialData = {
    item: [],
    pagination: null,
    totals: {
      total_capacity: 0,
      total_weight: 0,
      counts: 0,
      places: 0,
    },
  };

  const {
    data = initialData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allPackages', params],
    queryFn: () => allPackages.getAll(params),
    select: (item: IApiResponse<IAllPackagesRes>) => ({
      item: getAllPackagesAdapter(get(item, 'data', [])),
      pagination: get(item, 'pagination', null),
      totals: get(item, 'totals', {
        total_capacity: 0,
        total_weight: 0,
        counts: 0,
        places: 0,
      }),
    }),
  });

  return { data, isLoading, error };
};
