import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RelativeTime from 'dayjs/plugin/relativeTime';

import {
  Box,
  Stack,
  Badge,
  Avatar,
  MenuItem,
  MenuList,
  IconButton,
  ListItemText,
} from '@mui/material';

import { queryClient } from 'src/query';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { ICustomerRes, IOnlineUsers } from '../types/chat';
import { useGetChatLists } from '../hooks/useGetChatLists';

export const ChatHeader = () => {
  dayjs.extend(RelativeTime);
  const [searchParams] = useSearchParams();
  const [isOnline, setIsOnline] = useState<boolean>();
  const popover = usePopover();
  const chatId = searchParams.get('id');
  const [singleUser, setSingleUser] = useState<ICustomerRes>();
  const { data: chats } = useGetChatLists();
  useEffect(() => {
    if (chats && chats.data) {
      setSingleUser(chats.data.find((el: any) => el._id === chatId));
    }
  }, [chatId, chats]);
  console.log(singleUser);
  useEffect(() => {
    const onlineUsers: IOnlineUsers[] = queryClient.getQueryData(['online_users']) || [];
    setIsOnline(onlineUsers?.some((el) => el.user_id === singleUser?.user?._id));
  }, [singleUser?.user?._id, chatId]);
  return (
    <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Badge
          variant={isOnline ? 'online' : 'offline'}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Avatar src="" alt={singleUser?.profile?.first_name} />
        </Badge>

        <ListItemText
          primary={`${singleUser?.profile?.first_name} ${singleUser?.profile?.last_name}`}
          secondary={isOnline ? 'Online' : dayjs(singleUser?.user?.last_seen).fromNow()}
        />
      </Stack>
      <Stack direction="row" flexGrow={1} justifyContent="flex-end">
        <IconButton>
          <Iconify icon="solar:phone-bold" />
        </IconButton>

        <IconButton>
          <Iconify icon="solar:videocamera-record-bold" />
        </IconButton>

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </Box>
  );
};
