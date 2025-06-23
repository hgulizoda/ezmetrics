import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';
import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';

export const useArchiveChat = (chatId: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => axiosInstance.put(`chat/${chatId}/archive`).then((res) => res),
    onSuccess: () => {
      enqueueSnackbar('Chat arxivlandi', {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['chat_lists'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { archiveChatAsync: mutateAsync, isArchivingChat: isPending };
};
