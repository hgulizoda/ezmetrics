import { Box, useTheme, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from '../iconify';

export const NoData = () => {
  const { t } = useTranslate('lang');
  const theme = useTheme();
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
        <Iconify icon="ph:empty-bold" width={100} color={theme.palette.grey['600']} />
      </Box>
      <Typography variant="h5" color={theme.palette.grey['600']} fontWeight="bold">
        {t('packages.actions.dataNotFound')}
      </Typography>
      <Typography variant="body1" color={theme.palette.grey['600']} fontWeight="semibold">
        {t('packages.actions.noDataForRequest')}
      </Typography>
    </Box>
  );
};

export default NoData;
