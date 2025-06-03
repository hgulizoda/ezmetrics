import { useNavigate } from 'react-router';

import { Box, IconButton } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import Iconify from 'src/components/iconify';

import { AutoTable } from '../../../modules/price/ui/auto/Table';

const AutoTableRoot = () => {
  const { t } = useTranslate('lang');
  const navigate = useNavigate();

  return (
    <Container maxWidth={false}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5">{t('prices.table.title')}</Typography>
        </Box>
        <Box display="flex" ml={1} gap={1}>
          <IconButton onClick={() => navigate('/dashboard/prices/auto/create')}>
            <Iconify icon="uil:plus" width={25} />
          </IconButton>
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
        <Box height={700}>
          <AutoTable />
        </Box>
      </Box>
    </Container>
  );
};

export default AutoTableRoot;
