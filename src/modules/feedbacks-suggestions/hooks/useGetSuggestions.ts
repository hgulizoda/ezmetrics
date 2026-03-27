import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { suggestions } from '../api/fs';
import { suggestionMapper } from '../libs/suggestionsMapper';

interface Props {
  params: {
    limit: number;
    page: number;
  };
}

export const useGetSuggestions = ({ params }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['suggestions', params],
    queryFn: () => suggestions.getAll({ params }),
    select: (res) => ({
      suggestions: suggestionMapper(get(res, 'data', []) as any),
      totalRecords: get(res, 'pagination.total_records'),
    }),
  });

  return { data, isLoading };
};
