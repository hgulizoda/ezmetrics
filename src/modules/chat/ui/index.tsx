import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Stack } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import { Layout } from './layout';
import ChatArea from './chat-area';
import EmptyContentChat from './empty';
import CustomerProfile from './customer';
import CustomersList from './customer-list';
import { SendMessage } from './send-message';
import { ChatHeader } from './chat-area-header';
import { IMessageRes } from '../types/messages';

export default function MainChatHome() {
  const [searchParams] = useSearchParams();
  const hasChat = searchParams.get('id');

  const [replyMessage, setReplyMessage] = useState<IMessageRes | null>(null);
  const [editMessage, setEditMessage] = useState<IMessageRes | null>(null);
  const [searchChat, setSearchChat] = useState<Date>();

  const handleReplyMessage = (message: IMessageRes) => {
    setReplyMessage(message);
  };

  const clearReply = () => {
    setReplyMessage(null);
  };

  const layout = (
    <Layout
      sx={{
        minHeight: 0,
        flex: '1 1 0',
        borderRadius: 2,
        position: 'relative',
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.customShadows.card,
      }}
      slots={{
        nav: <CustomersList />,
        main: hasChat ? (
          <>
            <ChatArea
              onReplyMessage={handleReplyMessage}
              searchChat={searchChat}
              setEditMessage={setEditMessage}
            />
            <SendMessage
              key={hasChat}
              replyMessage={replyMessage}
              clearReply={clearReply}
              editMessage={editMessage}
              setEditMessage={setEditMessage}
            />
          </>
        ) : (
          <EmptyContentChat
            description="Chat boshlash uchun foydalanuvchilardan birini tanlang"
            title="Hayrli kun!"
          />
        ),
        details: hasChat ? (
          <Scrollbar>
            <CustomerProfile />
          </Scrollbar>
        ) : null,
        header: hasChat ? <ChatHeader setSearchChat={setSearchChat} /> : null,
      }}
    />
  );

  return <Stack height={670}>{layout}</Stack>;
}
