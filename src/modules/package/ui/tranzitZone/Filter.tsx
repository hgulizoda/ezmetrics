import { useForm } from 'react-hook-form';
import { useRef, useEffect } from 'react';

import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { IFilter } from './useFilter';
import Iconify from '../../../../components/iconify';

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

export const TransitZoneFilter = ({
  defaultValues,
  onChange,
  download,
  isPending,
}: FilterProps) => {
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

  return (
    <Box display="flex" mr={2}>
      <LoadingButton
        loading={isPending}
        onClick={download}
        startIcon={<Iconify sx={{ mr: -1.5 }} icon="ic:sharp-download" />}
        sx={{ minWidth: 30 }}
      />
    </Box>
  );
};
