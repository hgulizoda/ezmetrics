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
    select: (res) => {
      try {
        const rawData = get(res, 'data', []);
        const mappedFeedbacks = feedbacksMapper(rawData as any);
        
        return {
          feedbacks: mappedFeedbacks,
          totalRecords: get(res, 'pagination.total_records', 0),
        };
      } catch (error) {
        console.error('Error in useGetFeedbacks select:', error);
        return {
          feedbacks: [],
          totalRecords: 0,
        };
      }
    },
  });

  return { data, isLoading };
};
