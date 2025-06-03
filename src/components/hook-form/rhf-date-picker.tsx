import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePickerProps, StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';

type Props = DatePickerProps<any, any> & {
  name: string;
  helperText?: React.ReactNode;
};

export default function RHFDatePickerStatic({ name, helperText, sx = {}, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              {...field}
              {...other}
              sx={{ width: '100%', ...sx }}
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
