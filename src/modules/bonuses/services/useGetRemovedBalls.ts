import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { bonusesAPI } from '../api/bonusesAPi';
import { removedBallsMapper } from '../libs/removedBallsAdapter';

interface Props {
  id: string;
  params: {
    page: number;
    limit: number;
  };
}

export const useGetRemovedBalls = ({ id, params }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['removed-balls', id, params],
    queryFn: () => bonusesAPI.getRemovedBalls({ id, params }),
    select: (res) => ({
      orders: removedBallsMapper(get(res, 'data', [])),
      total_records: get(res, 'pagination.total_records'),
    }),
  });

  return { data, isLoading };
};
