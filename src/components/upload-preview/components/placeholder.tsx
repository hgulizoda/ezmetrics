import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ ...other }: BoxProps) {
  const { t } = useTranslate('lang');
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      <UploadIllustration sx={{ width: 150 }} />

      <Typography variant="subtitle1" color="text.secondary" mt={2}>
        {t('uploadText.upload')}
      </Typography>
    </Box>
  );
}
