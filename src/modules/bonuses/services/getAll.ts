import { get } from 'lodash';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { IFilters } from '../types/Filters';
import { bonusesAPI } from '../api/bonusesAPi';
import { IBonusesList } from '../types/BunusesList';
import { IApiResponse } from '../../../types/ApiRes';
import { getBonusesAdapter } from '../libs/bonusesAdapter';

export const useGetAllBonuses = (params: IFilters) => {
  const initData = useMemo(
    () => ({
      bonuses: [],
      pagination: {
        total_records: 5,
        current_page: 1,
        total_pages: 1,
        next_page: null,
        prev_page: null,
      },
    }),
    []
  );
  const { data = initData, isLoading } = useQuery({
    queryKey: ['bonuses', params],
    queryFn: () => bonusesAPI.getAll(params),
    // eslint-disable-next-line @typescript-eslint/no-shadow
    select: (data: IApiResponse<IBonusesList[]>) => ({
      bonuses: getBonusesAdapter(get(data, 'data', [])),
      pagination: get(data, 'data.pagination', {
        total_records: 5,
        current_page: 1,
        total_pages: 1,
        next_page: null,
        prev_page: null,
      }),
    }),
  });
  return { ...data, isLoading };
};
