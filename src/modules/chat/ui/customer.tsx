import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, Stack, Avatar, Collapse, useTheme, Typography, ListItemButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { formatPhoneNumber } from 'src/utils/format-phone-number';

import { queryClient } from 'src/query';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import ChatRoomAttachments from './attachments';
import { useGetMessages } from '../hooks/useGetMessages';
import { useGetChatLists } from '../hooks/useGetChatLists';
import type { IOnlineUsers, ICustomerRes } from '../types/chat';

export default function CustomerProfile() {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const { data } = useGetMessages(chatId || '');
  const [isOnline, setIsOnline] = useState<boolean>();
  const collapse = useBoolean(true);
  const [singleUser, setSingleUser] = useState<ICustomerRes>();
  const { data: chats } = useGetChatLists();
  useEffect(() => {
    if (chats && chats.data) {
      setSingleUser(chats.data.find((el: any) => el._id === chatId));
    }
  }, [chatId, chats]);

  const theme = useTheme();

  useEffect(() => {
    const onlineUsers: IOnlineUsers[] = queryClient.getQueryData(['online_users']) || [];
    setIsOnline(onlineUsers?.some((el) => el.user_id === singleUser?.user?._id));
  }, [singleUser?.user?._id, chatId]);
  const renderInfo = (
    <Stack alignItems="center" sx={{ py: 5 }}>
      <Avatar
        alt={singleUser?.profile?.first_name}
        src={singleUser?.profile?.avatar}
        sx={{ width: 96, height: 96, mb: 2 }}
      />
      <Typography variant="subtitle1">
        {singleUser?.profile?.first_name} {singleUser?.profile?.last_name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 1 }}>
        <Iconify icon="mdi:company" />
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {singleUser?.profile?.company_name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1, gap: 1 }}>
        <Iconify
          icon={isOnline ? 'wpf:online' : 'mingcute:time-fill'}
          width={18}
          color={isOnline ? theme.palette.success.light : theme.palette.text.secondary}
        />
        <Typography
          variant="body2"
          sx={{
            color: () => (isOnline ? theme.palette.success.light : theme.palette.text.secondary),
          }}
        >
          {isOnline
            ? 'Online'
            : `Last Seen: ${dayjs(singleUser?.user?.last_seen).format('MMM D, h:mm A')}`}
        </Typography>
      </Box>
    </Stack>
  );

  const renderBtn = (
    <ListItemButton
      onClick={collapse.onToggle}
      sx={{
        pl: 2.5,
        pr: 1.5,
        height: 40,
        flexShrink: 0,
        flexGrow: 'unset',
        typography: 'overline',
        color: 'text.secondary',
        bgcolor: 'background.neutral',
      }}
    >
      <Box component="span" sx={{ flexGrow: 1 }}>
        Information
      </Box>
      <Iconify
        width={16}
        icon={collapse.value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
      />
    </ListItemButton>
  );

  const renderContent = (
    <Stack
      spacing={2}
      sx={{
        px: 2,
        py: 2.5,
        '& svg': {
          mr: 1,
          flexShrink: 0,
          color: 'text.disabled',
        },
      }}
    >
      <Stack direction="row">
        <Iconify icon="solar:phone-bold" />
        <Typography variant="body2">{formatPhoneNumber(singleUser?.user?.phone_number)}</Typography>
      </Stack>
      <Stack direction="row">
        <Iconify icon="solar:user-id-bold" width={22} />
        <Typography variant="body2">{singleUser?.user?.user_id}</Typography>
      </Stack>
      <Stack direction="row">
        <Iconify width={22} icon="solar:verified-check-bold" />
        <Typography variant="body2" noWrap>
          <Label color={singleUser?.user?.status === 'notverified' ? 'error' : 'success'}>
            {singleUser?.user?.status === 'notverified' ? 'Tasdiqlanmagan' : 'Tasdiqlangan'}
          </Label>
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderInfo}

      {renderBtn}

      <div>
        <Collapse in={collapse.value}>{renderContent}</Collapse>
        <ChatRoomAttachments messages={data?.data} />
      </div>
    </>
  );
}
