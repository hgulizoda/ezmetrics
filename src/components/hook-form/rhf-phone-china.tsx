import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11); // Extract only digits, limit length to 11

  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`.trim();
};

export default function RHFPhoneFieldChina({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const formattedValue = field.value.startsWith('+86')
          ? `+86 ${formatPhoneNumber(field.value.replace(/\+86\s?/, ''))}`
          : `+86 ${formatPhoneNumber(field.value)}`;

        return (
          <TextField
            {...field}
            fullWidth
            autoComplete="off"
            error={!!error}
            helperText={error ? error.message : helperText}
            inputProps={{ maxLength: 17 }}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/\s/g, '').replace(/^\+86/, '');
              field.onChange(`+86${rawValue}`); // Save without spaces
            }}
            value={formattedValue} // Display formatted value
            placeholder="1XX XXXX XXXX"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="twemoji:flag-china" />
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
