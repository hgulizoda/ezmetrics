import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';

import { allLangs } from 'src/locales';

import SettingsButton from '../common/settings-button';
import AccountPopover from '../common/account-popover';
import { LanguagePopover } from '../common/language-popover';

export const ArchiveLayout = () => (
  <Container maxWidth={false}>
    <Box display="flex" ml={1} gap={1} justifyContent="flex-end" mb={2}>
      <LanguagePopover data={allLangs} />
      <SettingsButton />
      <AccountPopover />
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
        <Outlet />
      </Box>
    </Box>
  </Container>
);
