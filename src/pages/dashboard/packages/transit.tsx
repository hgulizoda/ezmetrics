import { Box } from '@mui/material';
import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';
import { TranzitZoneTable } from 'src/modules/package/ui/tranzitZone/Table';

import Iconify from '../../../components/iconify';
import { useBoolean } from '../../../hooks/use-boolean';
import { TransitTrucks } from '../../../modules/trucks/ui/transit/Table';

const TranzitZoneRootTable = () => {
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
          {t('packages.tableTitle.partOrder')}
        </Button>
      </Box>
      {tabChanger.value && <TranzitZoneTable />}
      {!tabChanger.value && <TransitTrucks />}
    </Box>
  );
};
export default TranzitZoneRootTable;
