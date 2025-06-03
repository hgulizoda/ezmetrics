import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useGetAdminInfo } from 'src/hooks/use-get-admin';

import { useFormatDate } from 'src/utils/iso-date';
import { formatPhoneNumber } from 'src/utils/format-phone-number';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { data, isLoading, error: fall } = useGetAdminInfo();
  const formatDate = useFormatDate();
  const router = useRouter();
  const { logout } = useAuthContext();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return 'Loading ...';
  if (fall) return 'Error';

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          alt="f"
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {data?.data[0].first_name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {data?.data[0].first_name} {data?.data[0].last_name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {data?.data[0].branch}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <Stack direction="row" gap={1} mb={1}>
            <Iconify icon="hugeicons:smart-phone-01" />
            <Typography fontWeight="medium" variant="body2" color="text.secondary">
              {data && formatPhoneNumber(data.data[0].phone)}
            </Typography>
          </Stack>

          <Stack direction="row" gap={1}>
            <Iconify icon="hugeicons:calendar-01" />
            <Typography variant="body2" fontWeight="medium" color="text.secondary">
              {data && formatDate(data.data[0].dob)}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Platformadan chiqish
        </MenuItem>
      </CustomPopover>
    </>
  );
}
