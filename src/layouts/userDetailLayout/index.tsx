import { Suspense } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router';

import IconButton from '@mui/material/IconButton';
import {
  Box,
  Card,
  alpha,
  Stack,
  Avatar,
  Button,
  useTheme,
  Container,
  Typography,
  tabsClasses,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import Image from 'src/assets/images/bgProfile.png';
import { allLangs, useTranslate } from 'src/locales';
import { useGetProfileMe } from 'src/modules/user/hook/profile';

import Iconify from 'src/components/iconify';

import SettingsButton from '../common/settings-button';
import AccountPopover from '../common/account-popover';
import { LanguagePopover } from '../common/language-popover';

export const UserDetailLayout = () => {
  const { t } = useTranslate('lang');
  const params = useParams() as { id: string };
  const theme = useTheme();
  const navigate = useNavigate();
  const pathname = usePathname();
  const { profile } = useGetProfileMe(params.id);

  return (
    <Box>
      <Container maxWidth={false}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <IconButton size="small" onClick={() => navigate(-1)}>
              <Iconify icon="weui:back-filled" />
            </IconButton>
            <Typography variant="h4">{t('profile.title')}</Typography>
          </Box>
          <Box display="flex" ml={1} gap={1}>
            <LanguagePopover data={allLangs} />
            <SettingsButton />
            <AccountPopover />
          </Box>
        </Box>
        <Card
          sx={{
            mb: 3,
            height: 290,
          }}
        >
          <Box
            sx={{
              ...bgGradient({
                color: alpha('#000', 0.8),
                imgUrl: Image,
              }),
              height: 1,
              color: 'common.white',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              display="flex"
              alignItems="center"
              gap="24px"
              sx={{
                left: { md: 24 },
                bottom: { md: 20 },
                zIndex: { md: 10 },
                pt: { xs: 6, md: 0 },
                position: { md: 'absolute' },
              }}
            >
              <Avatar
                alt="J"
                src={profile?.avatar}
                sx={{
                  width: { xs: 64, md: 128 },
                  height: { xs: 64, md: 128 },
                  border: `solid 2px ${theme.palette.common.white}`,
                }}
              />

              <Stack mb={2}>
                <Typography variant="h4">
                  {profile?.firstName} {profile?.lastName}
                </Typography>
                <Typography variant="body2">{`ID: ${profile?.userUniqueId}`}</Typography>
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: 1,
              height: 50,
              px: 3,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              [`& .${tabsClasses.flexContainer}`]: {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
              gap: 5,
            }}
          >
            <Button
              onClick={() => {
                navigate(`${paths.dashboard.users}/${params.id}`);
              }}
              startIcon={<Iconify icon="solar:user-id-linear" width={24} />}
              variant={pathname.includes('orders') ? 'outlined' : 'contained'}
            >
              {t('profile.tabs.profile')}
            </Button>
            <Button
              onClick={() => navigate(`${paths.dashboard.users}/${params.id}/orders`)}
              startIcon={<Iconify icon="hugeicons:package" width={24} />}
              variant={pathname.includes('orders') ? 'contained' : 'outlined'}
            >
              {t('profile.tabs.orders')}
            </Button>
          </Box>
        </Card>
        <Suspense>
          <Outlet />
        </Suspense>
      </Container>
    </Box>
  );
};
