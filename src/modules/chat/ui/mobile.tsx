import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { useMemo, useState, useEffect } from 'react';

import { Box, Badge, Stack, Avatar, IconButton, Typography } from '@mui/material';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ChatArea from './chat-area';
import CustomerProfile from './customer';
import CustomersList from './customer-list';
import { SendMessage } from './send-message';
import type { IMessageRes } from '../types/messages';
import { useGetChatLists } from '../hooks/useGetChatLists';
import type { ICustomerRes, IOnlineUsers } from '../types/chat';

dayjs.extend(RelativeTime);

type MobileUsersListViewProps = {
  onSelectChat: (chatId: string) => void;
};

type MobileChatViewProps = {
  onBack: () => void;
  onProfile: () => void;
  onReplyMessage: (message: IMessageRes) => void;
  replyMessage: IMessageRes | null;
  clearReply: () => void;
  editMessage: IMessageRes | null;
  setEditMessage: (msg: IMessageRes | null) => void;
  searchChat: Date | undefined;
};

type MobileProfileViewProps = {
  onBack: () => void;
};

type MobileHeaderProps = {
  onBack: () => void;
};

function useActiveChatUser() {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const { data: chats } = useGetChatLists();
  const [singleUser, setSingleUser] = useState<ICustomerRes>();
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    if (chats?.data) {
      setSingleUser(chats.data.find((el: any) => el._id === chatId));
    }
  }, [chatId, chats]);

  useEffect(() => {
    const onlineUsers: IOnlineUsers[] = queryClient.getQueryData(['online_users']) || [];
    setIsOnline(onlineUsers?.some((el) => el?.user_id === singleUser?.user?._id));
  }, [singleUser?.user?._id, chatId]);

  const avatarSrc = useMemo(() => {
    if (!singleUser?.profile?.avatar) return '';
    return `${import.meta.env.VITE_BASE_URL}${singleUser.profile.avatar}`;
  }, [singleUser?.profile?.avatar]);

  return { singleUser, isOnline, avatarSrc };
}

function MobileChatHeader({ onBack, onProfile }: MobileHeaderProps & { onProfile?: () => void }) {
  const { currentLang } = useTranslate('lang');
  const { singleUser, isOnline, avatarSrc } = useActiveChatUser();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        bgcolor: 'background.paper',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1.5, py: 1 }}>
        <IconButton onClick={onBack} aria-label="Back">
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
          <IconButton onClick={onProfile} sx={{ p: 0.25 }} aria-label="Open profile">
            <Badge
              variant={isOnline ? 'online' : 'offline'}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar src={avatarSrc} alt={singleUser?.profile?.first_name} />
            </Badge>
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {singleUser?.profile?.first_name} {singleUser?.profile?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {isOnline
                ? 'Online'
                : dayjs(singleUser?.user?.last_seen).locale(currentLang.adapterLocale).fromNow()}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

function MobileProfileHeader({ onBack }: MobileHeaderProps) {
  const { singleUser } = useActiveChatUser();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        bgcolor: 'background.paper',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1.5, py: 1 }}>
        <IconButton onClick={onBack} aria-label="Back to chat">
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {singleUser?.profile?.first_name} {singleUser?.profile?.last_name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            Profile
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export function MobileUsersListView({ onSelectChat }: MobileUsersListViewProps) {
  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'opacity 200ms ease',
      }}
    >
      <CustomersList onSelectChat={onSelectChat} />
    </Box>
  );
}

export function MobileChatView({
  onBack,
  onProfile,
  onReplyMessage,
  replyMessage,
  clearReply,
  editMessage,
  setEditMessage,
  searchChat,
}: MobileChatViewProps) {
  return (
    <Stack
      sx={{
        height: '100%',
        minHeight: 0,
        bgcolor: 'background.paper',
        transition: 'opacity 200ms ease',
      }}
    >
      <MobileChatHeader onBack={onBack} onProfile={onProfile} />
      <Stack sx={{ flex: '1 1 auto', minHeight: 0 }}>
        <ChatArea
          onReplyMessage={onReplyMessage}
          searchChat={searchChat}
          setEditMessage={setEditMessage}
        />
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 2,
            bgcolor: 'background.paper',
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <SendMessage
            replyMessage={replyMessage}
            clearReply={clearReply}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

export function MobileProfileView({ onBack }: MobileProfileViewProps) {
  return (
    <Stack
      sx={{
        height: '100%',
        minHeight: 0,
        bgcolor: 'background.paper',
        transition: 'opacity 200ms ease',
      }}
    >
      <MobileProfileHeader onBack={onBack} />
      <Scrollbar sx={{ flex: '1 1 auto', minHeight: 0 }}>
        <CustomerProfile />
      </Scrollbar>
    </Stack>
  );
}
