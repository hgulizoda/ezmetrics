import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { transport } from '../api/transport';
import { queryClient } from '../../../query';
import { IFilterProps } from '../../package/types/Filter';
import { transportsAdapter } from '../libs/transportAdapter';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useGetTransports = (params: IFilterProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transports', params],
    queryFn: () => transport.get(params),
    select: (res) => ({
      transports: transportsAdapter(get(res, 'data', [])),
      pagination: get(res, 'pagination'),
    }),
  });

  return { data, isLoading, error };
};

interface IProps {
  rowSelected: string[];
  params: IFilterProps;
}

export const useDeleteTransport = ({ rowSelected, params }: IProps) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      if (rowSelected.length > 0) {
        return Promise.all(rowSelected.map((item) => transport.delete(item)));
      }
      return transport.delete(id);
    },
    onSuccess: (res) => {
      enqueueSnackbar(t('mutate.deleted'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['transports', params],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });
  return { deleteTruck: mutateAsync, isDeleting: isPending };
};

export const useUnArchiveTruck = (params: IFilterProps) => {
  const { t } = useTranslate('lang');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => transport.unarchive(id),
    onSuccess: (res) => {
      enqueueSnackbar(t('mutate.packageBacked'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['transports', params],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { isUnArchiving: isPending, onUnArchive: mutateAsync };
};
