import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import { IUserId } from 'src/types/UserId';
import { IApiResponse } from 'src/types/ApiRes';

import { IFilterProps } from '../types/Filter';
import { chinaWarehouse } from '../api/packageApis';
import { IChinaBorderUpdate } from '../types/ResiduePackage';
import { IGetChinaWarehouseRes } from '../types/ChinaWarehouse';
import { chinaWarehouseAdapter } from '../libs/chinaWarehouseAdapter';

export const useGetChinaWarehouseOrders = (params: IFilterProps) => {
  const initialData = {
    orders: [],
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
    queryKey: ['chinaWarehouse', params],
    queryFn: () => chinaWarehouse.getAll(params),
    select: (res: IApiResponse<IGetChinaWarehouseRes>) => ({
      orders: chinaWarehouseAdapter(get(res, 'data', [])),
      pagination: get(res, 'pagination', null),
      totals: get(res, 'totals', { total_capacity: 0, total_weight: 0 }),
    }),
  });

  return {
    data,
    error,
    isLoading,
  };
};

export const useChangeToChinaBorder = (id: string, userId: string) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IChinaBorderUpdate) => chinaWarehouse.updateStatus(id, userId, data),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageSendedChinaBorder'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['chinaWarehouse'],
      });
      queryClient.invalidateQueries({
        queryKey: ['counts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['truckCount'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { updateStatus: mutateAsync, isPending };
};

interface IHookProps {
  data: IChinaBorderUpdate;
  ids: IUserId[];
}

export const useChangeToChinaBorderMultiple = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ data, ids }: IHookProps) =>
      Promise.all(ids.map((i) => chinaWarehouse.updateStatus(i.id, i.userId, data))),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packagesSendedChinaBorder'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['chinaWarehouse'],
      });
      queryClient.invalidateQueries({
        queryKey: ['counts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['truckCount'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { updateMultiStatus: mutateAsync, isPending };
};
