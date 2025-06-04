import { get } from 'lodash';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { IFilters } from '../types/Filters';
import { bonusesAPI } from '../api/bonusesAPi';
import { IBonusesList } from '../types/BunusesList';
import { IApiResponse } from '../../../types/ApiRes';
import { getBonusesAdapter } from '../libs/bonusesAdapter';

export const useGetUserBonuses = (params: IFilters, id: string) => {
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
    queryKey: ['bonuses_user', params],
    queryFn: () => bonusesAPI.getUserBonuses(params, id),
    // eslint-disable-next-line @typescript-eslint/no-shadow
    select: (data: IApiResponse<IBonusesList[]>) => ({
      // @ts-expect-error asd
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
