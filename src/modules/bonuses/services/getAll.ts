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
        total_records: 0,
        current_page: 0,
        total_pages: 0,
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
    select: (data: IApiResponse<IBonusesList>) => ({
      bonuses: getBonusesAdapter(data.data),
      pagination: get(data, 'pagination'),
    }),
  });
  return { ...data, isLoading };
};
