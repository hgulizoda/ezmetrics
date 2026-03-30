import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { usePathname, useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useAdminRole } from 'src/hooks/use-mocked-user';

import { useAuthContext } from 'src/auth/hooks';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { NavSectionVertical } from 'src/components/nav-section';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useAdminRole();
  const { user: authUser, logout } = useAuthContext();
  const settings = useSettingsContext();
  const router = useRouter();
  const popover = usePopover();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    popover.onClose();
    await logout();
    router.replace('/auth/login');
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ mt: 3, ml: ['18px'], mb: 4 }}>
        <Logo />
      </Box>

      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* User account card */}
      <Box
        onClick={popover.onOpen}
        sx={{
          mx: 2.5,
          mb: 2.5,
          p: 1.5,
          borderRadius: 2,
          cursor: 'pointer',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: 15,
              fontWeight: 700,
              bgcolor: (theme) =>
                authUser?.role === 'admin'
                  ? alpha(theme.palette.primary.main, 0.16)
                  : alpha(theme.palette.info.main, 0.16),
              color: authUser?.role === 'admin' ? 'primary.main' : 'info.main',
            }}
          >
            {authUser?.displayName?.charAt(0) || 'U'}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ lineHeight: 1.4 }}>
              {authUser?.displayName}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: 'text.disabled',
                textTransform: 'capitalize',
              }}
            >
              {authUser?.role}
            </Typography>
          </Box>

          <Iconify
            icon="eva:more-vertical-fill"
            width={18}
            sx={{ color: 'text.disabled', flexShrink: 0 }}
          />
        </Stack>
      </Box>

      {/* Logout dropup popover */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-left"
        sx={{ width: 220, p: 0 }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {authUser?.displayName}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary', mt: 0.25 }}>
            {authUser?.role === 'admin' ? 'Administrator' : 'Manager'}
          </Typography>
        </Box>

        <Box sx={{ px: 1, pb: 1, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
          <MenuItem
            onClick={() => {
              popover.onClose();
              settings.onUpdate('themeMode', settings.themeMode === 'dark' ? 'light' : 'dark');
            }}
            sx={{ mt: 0.5, borderRadius: 1, gap: 1.5, typography: 'body2' }}
          >
            <Iconify
              icon={settings.themeMode === 'dark' ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'}
              width={20}
            />
            {settings.themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              gap: 1.5,
              typography: 'body2',
              color: 'error.main',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <Iconify icon="solar:logout-2-bold-duotone" width={20} />
            Logout
          </MenuItem>
        </Box>
      </CustomPopover>
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
