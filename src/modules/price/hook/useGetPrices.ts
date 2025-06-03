import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { IFilterProps } from 'src/modules/package/types/Filter';

import { price } from '../api/price';
import { priceAdapter } from '../libs/priceAdapter';

interface Props {
  params: IFilterProps;
}

export const useGetPrice = ({ params }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prices', params],
    queryFn: () => price.get(params),
    select: (res) => priceAdapter(get(res, 'data', [])),
  });

  return { data, isLoading, error };
};
