import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';

type Props = DatePickerProps<any, any> & {
  name: string;
  helperText?: React.ReactNode;
};

export default function RHFDatePicker({ name, helperText, sx = {}, format, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              {...field}
              {...other}
              sx={{ width: '100%', ...sx }}
              format={format || 'dd.MM.yyyy'}
            />
          </LocalizationProvider>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </>
      )}
    />
  );
}
