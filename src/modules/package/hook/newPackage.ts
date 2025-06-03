import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import { newPackage } from '../api/packageApis';
import { CreatePackageFormType } from '../libs/createPackageScheme';

export const useCreatePackage = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: CreatePackageFormType) => newPackage.create(value),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageCreated'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['packages'],
      });
      queryClient.invalidateQueries({
        queryKey: ['allPackages'],
      });
      queryClient.invalidateQueries({
        queryKey: ['counts'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { createPackage: mutateAsync, isPending };
};
