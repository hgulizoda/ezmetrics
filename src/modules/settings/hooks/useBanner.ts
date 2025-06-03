import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { banner } from '../api/banner';
import { queryClient } from '../../../query';
import { getBannerAdapter } from '../libs/getBannersAdapter';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useCreateBanner = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: banner.create,
    onSuccess: () => {
      enqueueSnackbar(t('mutate.bannerUploaded'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['banner'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });
  return {
    creatingBanner: mutateAsync,
    isPosting: isPending,
  };
};

export const useGetBanner = () => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['banner'],
    queryFn: banner.get,
    select: (res) => getBannerAdapter(get(res, 'data', [])),
  });
  return { isLoading, images: data, error };
};

export const useReorderBanner = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: banner.reOrder,
    onSuccess: () => {
      enqueueSnackbar(t('mutate.bannerUpdated'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['banner'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    reorderBanner: mutateAsync,
    isOrdering: isPending,
  };
};

export const useDeleteBanner = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => banner.delete(id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.bannerDeleted'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['banner'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { deleletBanner: mutateAsync, isPending };
};
