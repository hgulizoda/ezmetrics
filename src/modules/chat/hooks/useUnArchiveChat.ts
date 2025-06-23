import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';
import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';

export const useUnArchiveChat = (chatId: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => axiosInstance.put(`chat/${chatId}/unarchive`).then((res) => res),
    onSuccess: () => {
      enqueueSnackbar('Chat arxivdan chiqarildi', {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['chat_lists'],
      });
      queryClient.invalidateQueries({
        queryKey: ['archived-chats'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { unArchiveChatAsync: mutateAsync, isUnArchivingChat: isPending };
};
