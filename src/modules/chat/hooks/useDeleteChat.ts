import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';
import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';

export const useDeleteChat = (chatId: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => axiosInstance.delete(`chat/${chatId}`).then((res) => res),
    onSuccess: () => {
      enqueueSnackbar("Chat o'chirildi", {
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

  return { deleteChatAsync: mutateAsync, isDeletingChat: isPending };
};
