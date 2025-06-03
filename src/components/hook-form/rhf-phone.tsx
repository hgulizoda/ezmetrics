import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 12); // Extract only digits, limit length

  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(
    7,
    9
  )}`.trim();
};

export default function RHFPhoneField({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const formattedValue = field.value.startsWith('+998')
          ? `+998 ${formatPhoneNumber(field.value.replace(/\+998\s?/, ''))}`
          : `+998 ${formatPhoneNumber(field.value)}`;

        return (
          <TextField
            {...field}
            fullWidth
            autoComplete="off"
            error={!!error}
            helperText={error ? error.message : helperText}
            inputProps={{ maxLength: 19 }}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/\s/g, '').replace(/^\+998/, '');
              field.onChange(`+998${rawValue}`); // Save without spaces
            }}
            value={formattedValue} // Display formatted value
            placeholder="XX XXX XX XX"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="twemoji:flag-uzbekistan" />
                </InputAdornment>
              ),
            }}
            {...other}
          />
        );
      }}
    />
  );
}
