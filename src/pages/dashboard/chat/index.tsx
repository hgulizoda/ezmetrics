import { Box, Container, Typography } from '@mui/material';
import { allLangs, useTranslate } from 'src/locales';
import MainChatHome from 'src/modules/chat/ui';
import AccountPopover from 'src/layouts/common/account-popover';
import SettingsButton from 'src/layouts/common/settings-button';
import { LanguagePopover } from 'src/layouts/common/language-popover';

export default function ChatRoot() {
  const { t } = useTranslate('lang');
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          mb: 5,
          gap: 3,
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4">{t('chat.title')}</Typography>
        </Box>

        <Box display="flex" ml={1} gap={1} alignItems="center">
          <LanguagePopover data={allLangs} />
          <SettingsButton />
          <AccountPopover />
        </Box>
      </Box>
      <MainChatHome />
    </Container>
  );
}
