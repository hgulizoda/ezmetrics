import { get } from 'lodash';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { bonusesAPI } from '../api/bonusesAPi';
import { getBonusesAdapter } from '../libs/bonusesAdapter';

export const useGetUserBonuses = (id: string) => {
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
    queryKey: ['bonuses_user', id],
    queryFn: () => bonusesAPI.getUserBonuses(id),
    select: (datas: any) => ({
      bonuses: getBonusesAdapter(get(datas, 'data', [])),
      pagination: get(datas, 'data.pagination', {
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
