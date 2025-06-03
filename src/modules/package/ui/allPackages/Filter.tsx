import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { IFilter } from './useFilter';
import Iconify from '../../../../components/iconify';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useGetTrucks } from '../../../settings/hooks/trucks';
import { generateRandomId } from '../../../../utils/randomId';
import FormProvider, { RHFSelect } from '../../../../components/hook-form';

const emptyValues = {
  truck: '',
};

interface FilterProps {
  defaultValues: {
    truck: string;
  };
  onChange: (values: IFilter) => void;
  isPending: boolean;
  download: () => void;
}

export const AllTableFilter = ({ defaultValues, onChange, isPending, download }: FilterProps) => {
  const openDrawer = useBoolean();
  const { data } = useGetTrucks();

  const isTouched = useRef(false);

  const form = useForm({
    defaultValues: {
      truck: defaultValues.truck || emptyValues.truck,
    },
  });

  useEffect(() => {
    if (form.formState.isDirty) {
      isTouched.current = true;
    }
  }, [form.formState.isDirty]);

  const { truck } = form.watch();

  useEffect(() => {
    if (isTouched.current) {
      onChange({
        truck,
      });
    }
  }, [onChange, truck]);

  const handleResetClick = () => {
    onChange(emptyValues);
    form.reset(emptyValues);
  };

  return (
    <Box display="flex">
      <LoadingButton
        loading={isPending}
        onClick={download}
        startIcon={<Iconify sx={{ mr: -1.5 }} icon="ic:sharp-download" />}
        sx={{ minWidth: 30 }}
      />

      <Box mr={2}>
        <FormProvider methods={form}>
          <Drawer
            open={openDrawer.value}
            onClose={openDrawer.onFalse}
            anchor="right"
            PaperProps={{ sx: { width: '400px', p: 2 } }}
            slotProps={{ backdrop: { invisible: true } }}
          >
            <RHFSelect fullWidth name="truck" label="Furalar">
              {data.trucks.map((item) => (
                <MenuItem value={item.id} key={generateRandomId(12)}>
                  {item.truckName}
                </MenuItem>
              ))}
            </RHFSelect>
            <Button sx={{ mt: 2 }} variant="contained" onClick={handleResetClick}>
              Qaytarish
            </Button>
          </Drawer>
        </FormProvider>
      </Box>
    </Box>
  );
};
