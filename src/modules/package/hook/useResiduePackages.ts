import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { IApiResponse } from 'src/types/ApiRes';

import { IFilterProps } from '../types/Filter';
import { witoutTruckPackages } from '../api/packageApis';
import { IResiduePackageRes } from '../types/ResiduePackage';
import { residuePackagesAdapter } from '../libs/resiudePackagesAdapter';

export const useGetWithoutTrucksPackages = (params: IFilterProps) => {
  const initialData = {
    packages: [],
    pagination: null,
    totals: {
      total_capacity: 0,
      total_weight: 0,
    },
  };
  const {
    data = initialData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['residuePackages', params],
    queryFn: () => witoutTruckPackages.getAll(params),
    select: (item: IApiResponse<IResiduePackageRes>) => ({
      packages: residuePackagesAdapter(get(item, 'data', [])),
      pagination: get(item, 'pagination', null),
      totals: get(item, 'totals', { total_capacity: 0, total_weight: 0 }),
    }),
  });

  return { data, error, isLoading };
};
