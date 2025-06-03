import { Box, Button } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { DeliveredTrucks } from 'src/modules/trucks/ui/delivered/Delivered';
import { DeliveredPackageTable } from 'src/modules/package/ui/delivered/Package';

import Iconify from 'src/components/iconify';

const DeliveredTable = () => {
  const tabChanger = useBoolean();
  const { t } = useTranslate('lang');
  return (
    <Box position="relative">
      <Box
        position="absolute"
        left={300}
        top={25}
        zIndex={999}
        maxWidth={380}
        gap={2}
        display="flex"
      >
        <Button
          variant={tabChanger.value ? 'outlined' : 'contained'}
          onClick={() => tabChanger.onFalse()}
          endIcon={<Iconify icon="ph:truck" />}
        >
          {t('packages.tableTitle.trucks')}
        </Button>
        <Button
          variant={tabChanger.value ? 'contained' : 'outlined'}
          onClick={() => tabChanger.onTrue()}
          endIcon={<Iconify icon="cuida:package-outline" />}
        >
          {t('packages.tableTitle.partAllOrder')}
        </Button>
      </Box>
      {tabChanger.value && <DeliveredPackageTable />}
      {!tabChanger.value && <DeliveredTrucks />}
    </Box>
  );
};

export default DeliveredTable;
