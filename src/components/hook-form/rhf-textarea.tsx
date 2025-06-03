import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------
import TextArea, { TextFieldProps } from '@mui/material/TextField';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFAreaField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextArea
          {...field}
          fullWidth
          autoComplete="off"
          type="text"
          value={field.value}
          onChange={field.onChange}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
          multiline
        />
      )}
    />
  );
}
