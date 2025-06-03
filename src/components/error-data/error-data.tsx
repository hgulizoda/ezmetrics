import { Box, useTheme, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from '../iconify';

export const ErrorData = () => {
  const theme = useTheme();
  const { t } = useTranslate('lang');
  return (
    <Box
      flexDirection="column"
      width="100%"
      height="500px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Box>
        <Iconify icon="nrk:404" width={100} color={theme.palette.grey['600']} />
      </Box>
      <Typography variant="h5" color={theme.palette.grey['600']} fontWeight="bold">
        {t('packages.actions.errorOccurred')}
      </Typography>
      <Typography variant="body1" color={theme.palette.grey['600']} fontWeight="semibold">
        {t('packages.actions.pleaseTryAgain')}
      </Typography>
    </Box>
  );
};

export default ErrorData;
