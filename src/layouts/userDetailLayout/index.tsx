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
  const isProfile = pathname.endsWith(params.id);
  const isBonus = pathname.endsWith('bonus');
  const isOrders = pathname.includes('orders');
  return (
    <Box>
      <Container maxWidth={false}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Box display="flex" alignItems="center" gap={3} mb={{ xs: 0, sm: 3 }}>
            <IconButton size="small" onClick={() => navigate(-1)}>
              <Iconify icon="weui:back-filled" />
            </IconButton>
            <Typography variant="h4">{t('profile.title')}</Typography>
          </Box>
          <Box display="flex" ml={{ xs: 0, sm: 1 }} gap={1}>
            <LanguagePopover data={allLangs} />
            <SettingsButton />
            <AccountPopover />
          </Box>
        </Box>
        <Card
          sx={{
            mb: 3,
            height: { xs: 'auto', md: 290 },
            minHeight: { xs: 350, md: 290 },
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
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              alignItems: 'center',
              width: 1,
              height: { xs: 'auto', sm: 50 },
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 0 },
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
              gap: { xs: 2, sm: 5 },
            }}
          >
            <Button
              onClick={() => navigate(`${paths.dashboard.users}/${params.id}`)}
              startIcon={<Iconify icon="solar:user-id-linear" width={24} />}
              variant={isProfile ? 'contained' : 'outlined'}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {t('profile.tabs.profile')}
            </Button>

            <Button
              onClick={() => navigate(`${paths.dashboard.users}/${params.id}/bonus`)}
              startIcon={<Iconify icon="mage:gift" width={24} />}
              variant={isBonus ? 'contained' : 'outlined'}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {t('bonus.title')}
            </Button>

            <Button
              onClick={() => navigate(`${paths.dashboard.users}/${params.id}/orders`)}
              startIcon={<Iconify icon="hugeicons:package" width={24} />}
              variant={isOrders ? 'contained' : 'outlined'}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
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
