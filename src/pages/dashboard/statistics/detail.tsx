import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Container, Typography, IconButton } from '@mui/material';

import { allLangs, useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import UserStatisticsDetailTable from 'src/modules/statistics/ui/userDetailTable';
import AccountPopover from 'src/layouts/common/account-popover';
import SettingsButton from 'src/layouts/common/settings-button';
import { LanguagePopover } from 'src/layouts/common/language-popover';

export default function StatisticsDetailPage() {
  const { t } = useTranslate('lang');
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(paths.dashboard.statistics);
  }, [navigate]);

  return (
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: 3,
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton size="small" onClick={handleBack}>
            <Iconify icon="weui:back-filled" />
          </IconButton>
          <Typography variant="h4" component="h2">
            {t('statistics.detailTitle')}
          </Typography>
        </Box>
        <Box display="flex" ml={1} gap={1}>
          <LanguagePopover data={allLangs} />
          <SettingsButton />
          <AccountPopover />
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
        <UserStatisticsDetailTable />
      </Box>
    </Container>
  );
}
