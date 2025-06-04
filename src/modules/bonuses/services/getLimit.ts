import { get } from 'lodash';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ILimit } from '../types/Limit';
import { bonusesAPI } from '../api/bonusesAPi';
import { IApiResponse } from '../../../types/ApiRes';
import { getLimitAdapter } from '../libs/limitAdapter';

interface UseGetBonusLimitResult {
  limits: ReturnType<typeof getLimitAdapter>;
  isLoading: boolean;
}

export const useGetBonusLimit = (): UseGetBonusLimitResult => {
  // Default data structure in case of no response
  const initData = useMemo(
    () => ({
      limits: getLimitAdapter(),
    }),
    []
  );

  const { data, isLoading } = useQuery<
    IApiResponse<ILimit>,
    Error,
    { limits: ReturnType<typeof getLimitAdapter> }
  >({
    queryKey: ['limit'],
    queryFn: bonusesAPI.getLimit,
    select: (response) => ({
      // @ts-expect-error
      limits: getLimitAdapter(get(response, 'data')),
    }),
  });

  return {
    limits: data?.limits ?? initData.limits,
    isLoading,
  };
};
