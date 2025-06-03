import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox, FormHelperText, FormControlLabel, FormControlLabelProps } from '@mui/material';

interface RHFCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  helperText?: React.ReactNode;
}

export function RHFCheckboxReturnObject({ name, helperText, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <FormControlLabel control={<Checkbox checked={field.value} {...field} />} {...other} />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error.message : helperText}</FormHelperText>
          )}
        </div>
      )}
    />
  );
}
