import { Box, Button } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { CustomsTrucks } from 'src/modules/trucks/ui/customs/Customs';
import { CustomsPackageTable } from 'src/modules/package/ui/customs/Package';

import Iconify from 'src/components/iconify';

const CustomsTable = () => {
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
      {tabChanger.value && <CustomsPackageTable />}
      {!tabChanger.value && <CustomsTrucks />}
    </Box>
  );
};

export default CustomsTable;
