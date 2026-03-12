import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTruckField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

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
