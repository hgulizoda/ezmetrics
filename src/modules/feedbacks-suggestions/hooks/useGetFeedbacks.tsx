import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { feedbacks } from '../api/fs';
import { feedbacksMapper } from '../libs/feedbacksAdapter';

interface Props {
  params: {
    limit: number;
    page: number;
  };
}

export const useGetFeedbacks = ({ params }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['feedbacks', params],
    queryFn: () => feedbacks.getAll({ params }),
    select: (res) => ({
      feedbacks: feedbacksMapper(get(res, 'data', [])),
      totalRecords: get(res, 'pagination.total_records'),
    }),
  });

  return { data, isLoading };
};
