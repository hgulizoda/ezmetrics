import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { IApiResponse } from 'src/types/ApiRes';

import { user } from '../api/userApi';
import { IUserRes } from '../types/User';
import { queryClient } from '../../../query';
import { IUserId } from '../../../types/UserId';
import { userAdapter } from '../libs/userAdapter';
import { IFilterProps } from '../../package/types/Filter';
import { UserFormTypeRequired } from '../libs/useSchemeRequired';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useGetUsersList = (params?: IFilterProps) => {
  const initialData = {
    users: [],
    pagination: null,
  };
  const {
    data = initialData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', params],
    queryFn: () => user.getAll(params && params),
    select: (item: IApiResponse<IUserRes>) => ({
      users: userAdapter(get(item, 'data', [])),
      pagination: get(item, 'pagination', null),
    }),
  });

  return { data, isLoading, error };
};

export const useUpdateUser = ({ id }: IUserId) => {
  const { t } = useTranslate('lang');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (status: string) => user.updateStatus(id, status),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.userVerify'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { isPending, updateStatus: mutateAsync };
};

interface IProps extends IUserId {
  status: string;
}

export const useUpdateUserMulti = (userIDs: IProps[]) => {
  const { t } = useTranslate('lang');
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (status: string) =>
      Promise.all(userIDs.map((i) => user.updateStatus(i.id, status))),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.usersVerify'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { multiPendings: isPending, updateStatusMultiple: mutateAsync };
};

export const useCreateUser = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: UserFormTypeRequired) => user.create(values),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.userCreated'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { createUser: mutateAsync, isPending };
};

export const useDeleteUser = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => user.delete(id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.userArchived'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { deleteUser: mutateAsync, isDeleting: isPending };
};

export const useDeleteUserMultiple = (ids: string[]) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => Promise.all(ids.map((i) => user.delete(i))),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.usersArchived'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { deleteUserMultiple: mutateAsync, isDeletingMultipe: isPending };
};
