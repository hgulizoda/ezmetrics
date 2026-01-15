import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useRef, useMemo, useState, MouseEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Search } from '@mui/icons-material';
import {
  Box,
  List,
  Badge,
  Avatar,
  Button,
  Tooltip,
  ListItem,
  useTheme,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  Autocomplete,
  useMediaQuery,
  ListItemAvatar,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { useTranslate } from 'src/locales';
import { IUser } from 'src/modules/user/types/User';
import { useGetUsersList } from 'src/modules/user/hook/user';
import AccountPopover from 'src/layouts/common/account-popover';
import { ContextMenuWrapper } from 'src/layouts/context/ContextMenu';
import { useGetChatLists } from 'src/modules/chat/hooks/useGetChatLists';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custome-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { useCreateRoom } from '../hooks/useCreateRoom';
import { useArchiveChat } from '../hooks/useArchiveChat';
import { ICustomerRes, IOnlineUsers } from '../types/chat';

type CustomersListProps = {
  onSelectChat?: (chatId: string) => void;
};

export default function CustomersList({ onSelectChat }: CustomersListProps) {
  const { t } = useTranslate('lang');
  const { currentLang } = useTranslate();
  const [chatId, setChatId] = useState<string>('');
  const navigate = useNavigate();
  const { data, isLoading } = useGetChatLists();

  const { isArchivingChat, archiveChatAsync } = useArchiveChat(chatId);
  const [search, setSearch] = useState<string>();
  const [autoOpen, setAutoOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const openChatAction = useBoolean();
  const openChatDeletion = useBoolean();

  const ref = useRef<HTMLDivElement>(null);

  const { data: onlineUsers } = useQuery<IOnlineUsers[]>({
    queryKey: ['online_users'],
  });
  const popover = usePopover();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchContact, setSearchContact] = useState<string>('');
  const findedContact: (ICustomerRes & { isOnline: boolean })[] = useMemo(
    () =>
      (onlineUsers &&
        data?.data
          .filter((el: any) => searchExistingChat(el, searchContact))
          .map((user: ICustomerRes) => {
            const isUserOnline = onlineUsers?.some((u) => u?.user_id === user?.user?._id);
            return {
              ...user,
              isOnline: isUserOnline,
            };
          })) ||
      [],
    [data?.data, searchContact, onlineUsers]
  );
  const theme = useTheme();
  const { createAsync } = useCreateRoom();
  const { data: users, isLoading: isPending } = useGetUsersList({
    page: 1,
    limit: 10000,
    search: debouncedSearch,
  });
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleSelectChat = (id: string) => {
    if (onSelectChat) {
      onSelectChat(id);
      return;
    }
    setSearchParams({ id });
  };

  const createNewChat = async (
    event: React.SyntheticEvent,
    value: {
      label: string;
      value: string;
    } | null
  ) => {
    event.preventDefault();
    if (value?.value) {
      await createAsync(value.value).then((res) => handleSelectChat(res.data._id));
    }
  };

  const handlePopoverOpen = (e: MouseEvent<HTMLElement>) => {
    popover.onOpen(e);

    setAutoOpen(true);
  };

  if (isLoading) return 'Loading...';

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ p: 2 }} display="flex" justifyContent="space-between" alignItems="center">
        <AccountPopover />

        <Box>
          <Tooltip title={t('chat.startNewChat')}>
            <IconButton onClick={handlePopoverOpen}>
              <Iconify icon="hugeicons:add-male" width={25} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('chat.archivedChats')}>
            <IconButton onClick={() => navigate('/dashboard/archive/chats')}>
              <Iconify icon="hugeicons:archive-02" width={25} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box px={2} mb={2}>
        <TextField
          fullWidth
          placeholder={t('chat.searchClient')}
          onChange={(e) => setSearchContact(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <List disablePadding sx={{ overflow: 'auto', flex: 1 }}>
        <Scrollbar>
          {findedContact.map((customer) => (
            <ContextMenuWrapper
              menu={
                <>
                  <MenuItem
                    onClick={() => {
                      setChatId(customer._id);
                      openChatAction.onTrue();
                    }}
                  >
                    <Iconify sx={{ mr: 1 }} icon="hugeicons:archive-02" />
                    Chatni arxivlash
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setChatId(customer._id);
                      openChatDeletion.onTrue();
                    }}
                    sx={{
                      color: 'error.main',
                    }}
                  >
                    <Iconify sx={{ mr: 1 }} icon="hugeicons:delete-02" />
                    Chatni o&apos;chirish
                  </MenuItem>
                </>
              }
            >
              <ListItem
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                button
                key={customer?.user?._id}
                onClick={() => {
                  handleSelectChat(customer?._id);
                }}
                sx={
                  searchParams.get('id') === customer?._id
                    ? { bgcolor: theme.palette.background.neutral }
                    : {}
                }
              >
                <ListItemAvatar>
                  <Badge
                    key={customer.isOnline.toString()}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant={customer.isOnline ? 'online' : 'offline'}
                  >
                    <Avatar
                      src={`${import.meta.env.VITE_BASE_URL}${customer?.profile?.avatar}`}
                      alt={customer?.profile?.first_name}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" width="100%" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {customer?.profile?.first_name} {customer?.profile?.last_name} (
                        {customer?.user?.user_id})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(customer.last_message?.created_at)
                          .locale(currentLang.adapterLocale)
                          .format('D MMM, h:mm A')}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="body2"
                        color={customer.unread_count_admin > 0 ? 'text.primary' : 'text.secondary'}
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        overflow="hidden"
                      >
                        {{
                          image: 'Rasm',
                          video: 'Video',
                          file: 'Fayl',
                          gif: 'Gif',
                        }[customer.last_message?.type] || customer.last_message?.content}
                      </Typography>
                      {customer.unread_count_admin > 0 && (
                        <Iconify
                          icon="material-symbols:circle"
                          color={theme.palette.info.light}
                          width={10}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            </ContextMenuWrapper>
          ))}
        </Scrollbar>
      </List>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          width: '300px',
          height: '450px',
        }}
      >
        <Autocomplete
          open={autoOpen}
          onOpen={() => setAutoOpen(true)}
          disablePortal
          openOnFocus
          ref={ref}
          loading={isPending}
          options={(
            users?.users?.slice().map((customer: IUser) => ({
              label: `${customer.customerId} — ${customer.fullName}`,
              value: customer?.id,
            })) || []
          ).sort((a, b) =>
            getOptionLabelFullName(a.label).localeCompare(getOptionLabelFullName(b.label))
          )}
          filterOptions={(x) => x} // disable client-side filtering
          getOptionLabel={(option) => option.label} // make sure Autocomplete knows what to display
          inputValue={search}
          onInputChange={(event: any, value: string, reason: string) => {
            setSearchParams({});
            if (reason !== 'reset') {
              setSearch(value);
            }
          }}
          onChange={createNewChat}
          noOptionsText={isPending ? 'Qidirilmoqda...' : 'Hech narsa topilmadi'}
          loadingText="Yuklanmoqda..."
          renderInput={(params) => (
            <TextField {...params} focused autoFocus placeholder="Mijozlar" />
          )}
        />
      </CustomPopover>

      {chatId && (
        <ConfirmDialog
          open={openChatAction.value}
          onClose={openChatAction.onFalse}
          title="Chatni arxivlash"
          content="Tanlangan chatni arxivlamoqchimsz? , ularni keyinchalik arxivlangan chatlardan topishingiz mumkun."
          action={
            <>
              <Button onClick={openChatAction.onFalse} variant="outlined" color="inherit">
                Bekor qilish
              </Button>
              <LoadingButton
                onClick={async () => {
                  await archiveChatAsync();
                  openChatAction.onFalse();
                }}
                loading={isArchivingChat}
                color="primary"
                variant="contained"
              >
                Arxivlash
              </LoadingButton>
            </>
          }
        />
      )}

      {chatId && (
        <ConfirmDialog
          open={openChatDeletion.value}
          onClose={openChatDeletion.onFalse}
          title="Chatni o'chirish"
          content="Tanlangan chatni o'chirmoqchimisiz? O'chirilgan chat butunlay o'chib ketadi , ularni orqaga qaytarish imkoni bo'lmaydi"
          action={
            <>
              <Button onClick={openChatDeletion.onFalse} variant="outlined" color="primary">
                Bekor qilish
              </Button>
              <LoadingButton
                onClick={async () => {
                  await archiveChatAsync();
                  openChatDeletion.onFalse();
                }}
                loading={isArchivingChat}
                color="error"
                variant="contained"
              >
                O&apos;chirish
              </LoadingButton>
            </>
          }
        />
      )}
    </Box>
  );
}

function searchExistingChat(profile: ICustomerRes, search: string) {
  return `${profile.user?.user_id} ${profile.profile?.first_name} ${profile.profile?.last_name}`
    .trim()
    .toLowerCase()
    .includes(search.trim().toLowerCase());
}

function getOptionLabelFullName(label: string) {
  return label.split(' — ')[1];
}
