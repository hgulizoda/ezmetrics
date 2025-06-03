import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { IFilterProps } from 'src/modules/package/types/Filter';

import { queryClient } from '../../../query';
import { notification } from '../api/notification';
import { notificationAdapter } from '../libs/notificationAdapter';
import { NotificationFormType } from '../libs/notificationScheme';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useGetAllNotifications = (params: IFilterProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notification.getAll(params),
    select: (res) => ({
      notifications: notificationAdapter(get(res, 'data', [])),
      pagination: get(res, 'paginaation', {}),
    }),
  });

  return { data, isLoading, error };
};

export const useSendNotifications = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: notification.send,
    onSuccess: () => {
      enqueueSnackbar(t('mutate.notificationSended'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { sendNotification: mutateAsync, isPending };
};

export const useDeleteNotifications = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: notification.delete,
    onSuccess: () => {
      enqueueSnackbar(t('mutate.notificationDeleted'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });
  return { deleteNotification: mutateAsync, isPending };
};

export const useUpdateNotifications = (id: string) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: NotificationFormType) => notification.update(id, data),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.notificationUpdated'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });
  return { updateNotification: mutateAsync, isPending };
};
