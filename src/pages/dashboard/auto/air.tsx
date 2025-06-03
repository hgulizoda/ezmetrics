import { useMemo } from 'react';

import { Box, Divider, Container, Typography } from '@mui/material';

import { useFormatDate } from 'src/utils/iso-date';

import { allLangs, useTranslate } from 'src/locales';
import { AirPrice } from 'src/modules/price/ui/air/Air';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { useGetPrice } from 'src/modules/price/hook/useGetPrices';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import { NoData } from 'src/components/no-data copy/no-data';
import { ErrorData } from 'src/components/error-data/error-data';
import Circular from 'src/components/loading-screen/circular-screen';

const AirPriceRoot = () => {
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const { data, error, isLoading } = useGetPrice({ params: { search: '' } });
  const airPrice = useMemo(() => data?.find((item) => item.transportType === 'air'), [data]);
  if (isLoading) return <Circular />;
  if (error) return <ErrorData />;
  if (!data) return <NoData />;
  return (
    <>
      <Container maxWidth={false}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5">{t('prices.formTable.air.title')}</Typography>

            <Typography variant="subtitle2" color="GrayText">
              {t('prices.formTable.air.updatedDate')}:{' '}
              {airPrice?.updatedAt && formatDate(airPrice?.updatedAt as string)}
            </Typography>
          </Box>

          <Box display="flex" ml={1} gap={1}>
            <LanguagePopover data={allLangs} />
            <SettingsButton />
            <AccountPopover />
          </Box>
        </Box>
      </Container>
      <Divider sx={{ my: 2 }} />
      <Container maxWidth={false}>
        <AirPrice data={airPrice} />
      </Container>
    </>
  );
};

export default AirPriceRoot;
