import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { users } from '../api/users';
import { queryClient } from '../../../query';
import { IFilterProps } from '../../package/types/Filter';
import { userAdapter } from '../../user/libs/userAdapter';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useGetArchivedUsers = (params: IFilterProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['archiveusers', params],
    queryFn: () => users.get(params),
    select: (res) => ({
      users: userAdapter(get(res, 'data', [])),
      pagination: get(res, 'pagination'),
    }),
  });

  return { isLoading, error, data };
};

interface IProps {
  selectedUsers: string[];
  params?: IFilterProps;
}

export const useDeleteUser = ({ selectedUsers, params }: IProps) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      if (selectedUsers.length > 0) {
        return Promise.all(selectedUsers.map((user) => users.delete(user)));
      }
      return users.delete(id);
    },
    onSuccess: () => {
      enqueueSnackbar(t('mutate.userDeleted'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['archiveusers', params],
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
export const useUnarchiveUser = ({ selectedUsers }: IProps) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      if (selectedUsers.length > 0) {
        return Promise.all(selectedUsers.map((user) => users.unarchive(user)));
      }
      return users.unarchive(id);
    },
    onSuccess: () => {
      enqueueSnackbar(t('mutate.userUnArchived'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['archiveusers'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    onUnarchiving: mutateAsync,
    isUnarchiving: isPending,
  };
};
