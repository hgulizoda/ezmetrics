import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { useState, Dispatch, useEffect, SetStateAction } from 'react';

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Stack, Badge, Avatar, Tooltip, IconButton, ListItemText } from '@mui/material';

import { ru, enUS } from 'date-fns/locale';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { ICustomerRes, IOnlineUsers } from '../types/chat';
import { useGetChatLists } from '../hooks/useGetChatLists';

interface Props {
  setSearchChat: Dispatch<SetStateAction<Date | undefined>>;
}

export const ChatHeader = ({ setSearchChat }: Props) => {
  dayjs.extend(RelativeTime);
  const { currentLang, t } = useTranslate('lang');
  const [searchParams] = useSearchParams();
  const [isOnline, setIsOnline] = useState<boolean>();
  const popover = usePopover();
  const chatId = searchParams.get('id');
  const [singleUser, setSingleUser] = useState<ICustomerRes>();
  const { data: chats } = useGetChatLists();

  const getLocale = () => {
    if (currentLang.value === 'ru') return ru;
    return enUS;
  };
  useEffect(() => {
    if (chats && chats.data) {
      setSingleUser(chats.data.find((el: any) => el._id === chatId));
    }
  }, [chatId, chats]);

  useEffect(() => {
    const onlineUsers: IOnlineUsers[] = queryClient.getQueryData(['online_users']) || [];
    setIsOnline(onlineUsers?.some((el) => el?.user_id === singleUser?.user?._id));
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
          secondary={
            isOnline
              ? 'Online'
              : dayjs(singleUser?.user?.last_seen).locale(currentLang.adapterLocale).fromNow()
          }
        />
      </Stack>
      <Stack direction="row" flexGrow={1} justifyContent="flex-end">
        <Tooltip title={t('chat.searchInChat')}>
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="solar:calendar-search-bold-duotone" />
          </IconButton>
        </Tooltip>
      </Stack>
      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getLocale()}>
          <DateCalendar
            onChange={(e) => {
              setSearchChat(e);
              popover.onClose();
            }}
          />
        </LocalizationProvider>
      </CustomPopover>
    </Box>
  );
};
