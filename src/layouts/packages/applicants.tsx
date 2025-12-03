import * as React from 'react';
import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import { Box, useTheme, Container, Typography, IconButton } from '@mui/material';

import { allLangs, useTranslate } from 'src/locales';
import { useGetCount } from 'src/modules/package/hook/useGetCount';
import { useGetTruckCount } from 'src/modules/package/hook/useGetTruckCount';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import SettingsButton from '../common/settings-button';
import AccountPopover from '../common/account-popover';
import { LanguagePopover } from '../common/language-popover';

export const ApplicantsLayout = () => {
  const { t } = useTranslate('lang');
  const { data: count } = useGetCount();
  const { data: truckCount } = useGetTruckCount();

  const { pathname } = useLocation();
  const theme = useTheme();

  const [value, setValue] = React.useState(pathname);

  const navigate = useNavigate();
  const handleChangeSelect = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          marginBottom: '24px',
          gap: { xs: 2, sm: 0 },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
        }}
      >
        <Box sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' }, alignItems: 'center', gap: 3 }}>
          <Typography variant="h4" component="h2" display="flex" gap={1}>
            {t('packages.title')}
            <Typography variant="h4" color={theme.palette.grey[400]}>
              ({count?.data.all})
            </Typography>
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <IconButton onClick={() => navigate('/dashboard/add-package')}>
            <Iconify icon="gravity-ui:plus" width={25} />
          </IconButton>

          <Box display="flex" ml={{ xs: 0, sm: 1 }} gap={1}>
            <LanguagePopover data={allLangs} />
            <SettingsButton />
            <AccountPopover />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          borderRadius: '16px',
          border: '1px solid #919EAB1F',
          boxShadow: '0px 12px 24px -4px #919EAB1F',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: '100%', padding: '0 16px' }}>
          <Tabs
            value={value}
            onChange={handleChangeSelect}
            aria-label="wrapped label tabs example"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              justifyContent: 'space-between',
              boxShadow: (i) => `inset 0 -2px 0 0 ${alpha(i.palette.grey[500], 0.08)}`,
            }}
          >
            <Tab
              value="/dashboard/all"
              label={t('packages.status.all')}
              icon={
                <Label variant={value === '/dashboard/all' ? 'filled' : 'soft'} color="primary">
                  {count?.data.all ?? 0}
                </Label>
              }
              iconPosition="end"
            />
            <Tab
              value="/dashboard/all/china-warehouse"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {t('packages.status.chinaWarehouse')}{' '}
                  <Iconify sx={{ ml: '2px' }} icon="twemoji:flag-china" />
                  <Label
                    variant={value === '/dashboard/all/china-warehouse' ? 'filled' : 'soft'}
                    color="primary"
                    sx={{ ml: '8px' }}
                  >
                    {count?.data.in_china_warehouse ?? 0}
                  </Label>
                </Box>
              }
              icon={<Iconify icon="ic:twotone-warehouse" width={24} />}
              iconPosition="start"
            />

            <Tab
              value="/dashboard/all/china-border"
              label={
                <Box>
                  {t('packages.status.chinaBorder')}
                  <Label
                    variant={value === '/dashboard/all/china-border' ? 'filled' : 'soft'}
                    color="primary"
                    sx={{ ml: '8px' }}
                  >
                    {truckCount?.to_china_border ?? 0}
                  </Label>
                </Box>
              }
              icon={<Iconify icon="fluent:road-20-filled" width={24} />}
              iconPosition="start"
            />

            <Tab
              value="/dashboard/all/tranzit-zone"
              label={
                <Box>
                  {t('packages.status.transit')}
                  <Label
                    variant={value === '/dashboard/all/tranzit-zone' ? 'filled' : 'soft'}
                    color="primary"
                    sx={{ ml: '8px' }}
                  >
                    {truckCount?.in_transit ?? 0}
                  </Label>
                </Box>
              }
              icon={<Iconify icon="mdi:transit-detour" width={24} />}
              iconPosition="start"
            />

            <Tab
              value="/dashboard/all/uzb-customs"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {t('packages.status.uzbCustoms')}{' '}
                  <Iconify sx={{ ml: '2px' }} icon="twemoji:flag-uzbekistan" />
                  <Label
                    variant={value === '/dashboard/all/uzb-customs' ? 'filled' : 'soft'}
                    color="primary"
                    sx={{ ml: '8px' }}
                  >
                    {truckCount?.to_uzb_customs ?? 0}
                  </Label>
                </Box>
              }
              icon={<Iconify icon="fluent-emoji-high-contrast:customs" width={24} />}
              iconPosition="start"
            />

            <Tab
              value="/dashboard/all/customs"
              label={
                <Box>
                  {t('packages.status.normalize')}
                  <Label
                    variant={value === '/dashboard/all/customs' ? 'filled' : 'soft'}
                    color="primary"
                    sx={{ ml: '8px' }}
                  >
                    {truckCount?.in_customs ?? 0}
                  </Label>
                </Box>
              }
              icon={<Iconify icon="hugeicons:legal-document-01" width={24} />}
              iconPosition="start"
            />

            <Tab
              value="/dashboard/all/delivered"
              label={
                <Box>
                  {t('packages.status.delivered')}
                  <Label
                    variant={value === '/dashboard/all/delivered' ? 'filled' : 'soft'}
                    color="primary"
                    sx={{ ml: '8px' }}
                  >
                    {truckCount?.delivered ?? 0}
                  </Label>
                </Box>
              }
              icon={<Iconify icon="hugeicons:package-delivered" width={24} />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </Box>
    </Container>
  );
};

export default ApplicantsLayout;
