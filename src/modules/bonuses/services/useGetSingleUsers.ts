import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { bonusesAPI } from '../api/bonusesAPi';
import { singleBonusMapper } from '../libs/singleUserBonus';

interface Props {
  id: string;
  params: {
    page: number;
    limit: number;
  };
}

export const useGetSingleUsers = ({ id, params }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['single-bonuses', id, params],
    queryFn: () => bonusesAPI.getSingleUserBonus({ id, params }),
    select: (res) => ({
      orders: singleBonusMapper(get(res, 'data', [])),
      total_records: get(res, 'pagination.total_records'),
    }),
  });

  return { data, isLoading };
};
