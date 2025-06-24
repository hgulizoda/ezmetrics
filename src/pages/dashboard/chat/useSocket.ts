import { useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import { queryClient } from 'src/query';
import { useAuthContext } from 'src/auth/hooks';
import { IMessage, ICustomerRes, IOnlineUsers } from 'src/modules/chat/types/chat';

export const useChatSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?._id) {
      const socket = io(`${import.meta.env.VITE_BASE_URL}/chat`, {
        extraHeaders: {
          user_id: user?._id,
          is_admin: 'true',
        },
      });
      const handleNewMessage = (data: IMessage) => {
        queryClient.setQueryData(['messages', data.room], (oldData: { data: ICustomerRes[] }) => {
          const old = oldData?.data || [];
          return { data: [...old, data] };
        });
      };
      socket.on('new_message', handleNewMessage);
      socket.on('send_message', handleNewMessage);
      socket.on('room_list', (data: ICustomerRes[]) => {
        queryClient.setQueryData(['chat_lists'], () => ({ data: [...data] }));
      });
      socket.on('online_users', (data: IOnlineUsers[]) => {
        queryClient.setQueryData(['online_users'], () => data);
        queryClient.invalidateQueries({ queryKey: ['chat_lists'] });
      });
      socketRef.current = socket;
      return () => {
        socket.disconnect();
        socket.removeAllListeners();
      };
    }

    return () => {};
  }, [user?._id]);

  const emit = (event: string, payload: any) => {
    socketRef.current?.emit(event, payload);
  };

  return { emit };
};
