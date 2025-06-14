import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useRef, useMemo, useState, MouseEvent } from 'react';

import { Search } from '@mui/icons-material';
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  ListItem,
  useTheme,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  Autocomplete,
  ListItemAvatar,
  InputAdornment,
} from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import { IUser } from 'src/modules/user/types/User';
import { useGetUsersList } from 'src/modules/user/hook/user';
import AccountPopover from 'src/layouts/common/account-popover';
import { useGetChatLists } from 'src/modules/chat/hooks/useGetChatLists';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { useCreateRoom } from '../hooks/useCreateRoom';
import { ICustomerRes, IOnlineUsers } from '../types/chat';

export default function CustomersList() {
  const { data, isLoading } = useGetChatLists();
  const [search, setSearch] = useState<string>();
  const [autoOpen, setAutoOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

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

  const createNewChat = async (
    event: React.SyntheticEvent,
    value: {
      label: string;
      value: string;
    } | null
  ) => {
    event.preventDefault();
    if (value?.value) {
      await createAsync(value.value).then((res) => setSearchParams({ id: res.data._id }));
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
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ p: 2 }} display="flex" justifyContent="space-between" alignItems="center">
        <AccountPopover />

        <Tooltip title="Yangi chat boshlash">
          <IconButton onClick={handlePopoverOpen}>
            <Iconify icon="hugeicons:add-male" width={25} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box px={2} mb={2}>
        <TextField
          fullWidth
          placeholder="Mijozni qidirish"
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
            <ListItem
              button
              key={customer?.user?._id}
              onClick={() => {
                setSearchParams({ id: customer?._id });
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
                      {dayjs(customer.last_message?.created_at).format('D MMM, h:mm A')}
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
