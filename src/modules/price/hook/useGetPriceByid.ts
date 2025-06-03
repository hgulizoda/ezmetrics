import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { price } from '../api/price';
import { priceTier } from '../libs/priceAdapter';

export const useGetPriceByid = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['price-id', id],
    queryFn: () => price.getById(id),
    select: (res) => {
      const response = priceTier(get(res, 'data'));
      return response;
    },
  });

  return { data, isLoading, error };
};
