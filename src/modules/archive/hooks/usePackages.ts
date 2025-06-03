import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { packages } from '../api/packages';
import { queryClient } from '../../../query';
import { IFilterProps } from '../../package/types/Filter';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';
import { getAllPackagesAdapter } from '../../package/libs/allPackagesAdapter';

export const useGetArchivePackages = (params: IFilterProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['packagesarchived', params],
    queryFn: () => packages.get(params),
    select: (res) => ({
      packages: getAllPackagesAdapter(get(res, 'data', [])),
      pagination: get(res, 'pagination'),
    }),
  });

  return { data, isLoading, error };
};

interface IProps {
  selectedPackages: string[];
  params: IFilterProps;
}

export const useDeletePackage = ({ selectedPackages, params }: IProps) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      if (selectedPackages.length > 0) {
        return Promise.all(selectedPackages.map((i) => packages.delete(i)));
      }
      return packages.delete(id);
    },
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageDeleted'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['packagesarchived', params],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    onDeleting: mutateAsync,
    isDeleting: isPending,
  };
};

export const useUnArchivePackage = (params: IFilterProps) => {
  const { t } = useTranslate('lang');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => packages.unarchive(id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageBacked'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['packagesarchived', params],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { isUnArchiving: isPending, onUnArchive: mutateAsync };
};
