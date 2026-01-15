import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Fade, Stack, useMediaQuery } from '@mui/material';

import { useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';

import { Layout } from './layout';
import ChatArea from './chat-area';
import EmptyContentChat from './empty';
import CustomerProfile from './customer';
import CustomersList from './customer-list';
import { SendMessage } from './send-message';
import { ChatHeader } from './chat-area-header';
import { IMessageRes } from '../types/messages';
import { MobileChatView, MobileProfileView, MobileUsersListView } from './mobile';

export default function MainChatHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasChat = searchParams.get('id');
  const viewParam = searchParams.get('view');
  const { t } = useTranslate('lang');
  const isMobile = useMediaQuery('(max-width:768px)');
  const [replyMessage, setReplyMessage] = useState<IMessageRes | null>(null);
  const [editMessage, setEditMessage] = useState<IMessageRes | null>(null);
  const [searchChat, setSearchChat] = useState<Date>();

  const handleReplyMessage = (message: IMessageRes) => {
    setReplyMessage(message);
  };

  const clearReply = () => {
    setReplyMessage(null);
  };

  const resolvedMobileView = (() => {
    if (viewParam === 'profile' && hasChat) return 'profile';
    if ((viewParam === 'chat' || (!viewParam && hasChat)) && hasChat) return 'chat';
    return 'list';
  })();

  const updateSearchParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleMobileSelectChat = (chatId: string) => {
    updateSearchParams({ id: chatId, view: 'chat' });
  };

  const handleBackToList = () => {
    updateSearchParams({ view: 'list' });
  };

  const handleOpenProfile = () => {
    updateSearchParams({ view: 'profile' });
  };

  const handleBackToChat = () => {
    updateSearchParams({ view: 'chat' });
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
            description={t('chat.greeting.subtitle')}
            title={t('chat.greeting.title')}
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

  if (isMobile) {
    return (
      <Stack
        sx={{
          height: 'calc(100vh - 180px)',
          minHeight: 0,
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
          overflow: 'hidden',
        }}
      >
        {resolvedMobileView === 'list' && (
          <Fade in timeout={200}>
            <div style={{ height: '100%' }}>
              <MobileUsersListView onSelectChat={handleMobileSelectChat} />
            </div>
          </Fade>
        )}
        {resolvedMobileView === 'chat' && hasChat && (
          <Fade in timeout={200}>
            <div style={{ height: '100%' }}>
              <MobileChatView
                onBack={handleBackToList}
                onProfile={handleOpenProfile}
                onReplyMessage={handleReplyMessage}
                replyMessage={replyMessage}
                clearReply={clearReply}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                searchChat={searchChat}
              />
            </div>
          </Fade>
        )}
        {resolvedMobileView === 'profile' && hasChat && (
          <Fade in timeout={200}>
            <div style={{ height: '100%' }}>
              <MobileProfileView onBack={handleBackToChat} />
            </div>
          </Fade>
        )}
      </Stack>
    );
  }

  return <Stack height={670}>{layout}</Stack>;
}
