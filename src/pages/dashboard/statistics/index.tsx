import { Box, Container, Typography } from '@mui/material';

import { allLangs } from 'src/locales';
import TableStatistics from 'src/modules/statistics/ui/table';
import AccountPopover from 'src/layouts/common/account-popover';
import SettingsButton from 'src/layouts/common/settings-button';
import { LanguagePopover } from 'src/layouts/common/language-popover';

export default function Page() {
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
        <Typography variant="h4" component="h2" display="flex" gap={1}>
          Umumiy statistika
        </Typography>
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
        <TableStatistics />
      </Box>
    </Container>
  );
}
