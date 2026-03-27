import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query';

export const useUnArchiveChat = (_chatId: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { success: true };
    },
    onSuccess: () => {
      enqueueSnackbar('Chat arxivdan chiqarildi', {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' },
      });
      queryClient.invalidateQueries({ queryKey: ['chat_lists'] });
      queryClient.invalidateQueries({ queryKey: ['archived-chats'] });
    },
  });
  return { unArchiveChatAsync: mutateAsync, isUnArchivingChat: isPending };
};
