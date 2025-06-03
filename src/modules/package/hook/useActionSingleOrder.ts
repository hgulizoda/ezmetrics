import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { queryClient } from '../../../query';
import { singleOrder } from '../api/packageApis';
import { getProfileOrder } from '../libs/userProfileOrdersAdapter';
import { CreatePackageFormType } from '../libs/createPackageScheme';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useActionSingleOrder = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['singleOrder'],
    queryFn: () => singleOrder.get(id),
    select: (res) => getProfileOrder(get(res, 'data')),
    enabled: !!id,
  });

  return { singleOrderData: data, isGetting: isLoading, orderError: error };
};

export const useUpdateSingleOrder = (id: string) => {
  const { t } = useTranslate('lang');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (values: CreatePackageFormType) => singleOrder.update(values, id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageUpdated'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    updateSinglePackage: mutateAsync,
    isUpdating: isPending,
  };
};

interface IID {
  id: string;
  userID: string;
}

export const useBackPrevStepSingleOrder = (status: string, query: string) => {
  const { t } = useTranslate('lang');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: IID) => singleOrder.goBack(data.id, data.userID, status),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageBacked'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: [query],
      });
      queryClient.invalidateQueries({
        queryKey: ['allPackages'],
      });
      queryClient.invalidateQueries({
        queryKey: ['truckCount'],
      });
      queryClient.invalidateQueries({
        queryKey: ['counts'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });
  return { onBackPackage: mutateAsync, isBacking: isPending };
};
