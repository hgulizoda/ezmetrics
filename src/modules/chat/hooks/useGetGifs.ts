import { GiphyFetch } from '@giphy/js-fetch-api';
import { useQuery } from '@tanstack/react-query';

const gf = new GiphyFetch('5yRTpwTso7ZGRXlyf4GpXNQ49q61yaLb');

export const useGetGifs = (searchTerm: string) => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['gifs', searchTerm],
    queryFn: async () => gf.search(searchTerm, { limit: 50 }).then((res) => res.data),
  });

  return { isLoading, error, data, isFetching };
};
