import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTruckField({ name, helperText, type, ...other }: Props) {
  const { control, setValue } = useFormContext();

  // Get last two digits of the current year
  const currentYearLastTwo = new Date().getFullYear().toString().slice(-2);
  const defaultValue = `${currentYearLastTwo}`; // Only the year, no "000"

  useEffect(() => {
    setValue(name, defaultValue); // Set default value when component mounts
  }, [setValue, name, defaultValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type="text"
          value={field.value}
          onChange={(event) => {
            let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
            if (value.length > 5) value = value.slice(0, 5); // Restrict to 5 digits

            // Ensure the value starts with the current year's last two digits
            if (!value.startsWith(currentYearLastTwo)) {
              value = currentYearLastTwo + value.slice(2);
            }

            field.onChange(value);
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
            maxLength: 5, // Ensure max length
          }}
          {...other}
        />
      )}
    />
  );
}
