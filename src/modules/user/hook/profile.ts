import { get } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { profile } from '../api/userApi';
import { queryClient } from '../../../query';
import { UserFormType } from '../libs/userScheme';
import { getProfileAdapter } from '../libs/profileMeAdapter';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useGetProfileMe = (id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => profile.getProfile(id),
    select: (res) => getProfileAdapter(get(res, 'data')),
  });

  return {
    profile: data,
    error,
    isLoading,
  };
};

export const useUpdateProfile = (id: string) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: UserFormType) => profile.updateProfile(id, data),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.userInfoUpdate'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
    onError: (error) => {
      showErrorSnackbar(error);
    },
  });

  return {
    updateProfile: mutateAsync,
    isPending,
  };
};
