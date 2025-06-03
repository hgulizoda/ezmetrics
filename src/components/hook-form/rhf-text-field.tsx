import { Controller, useFormContext } from 'react-hook-form';

import TextField, { TextFieldProps } from '@mui/material/TextField';

type RHFTextFieldType = 'text' | 'number' | 'id' | 'password' | 'truck'; // Added 'truck'

type Props = TextFieldProps & {
  name: string;
  type?: RHFTextFieldType; // Custom type
  helperText?: string;
};

export default function RHFTextField({ name, type, helperText, ...other }: Props) {
  const { control } = useFormContext();
  const prefix = type === 'id' ? 'SJ-' : '';

  const getMaxLength = () => {
    if (type === 'id') return prefix.length + 4;
    if (type === 'truck') return 4;
    return undefined;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          autoComplete="off"
          value={type === 'id' ? prefix + (field.value?.replace(prefix, '') || '') : field.value}
          onChange={(event) => {
            let { value } = event.target;

            if (type === 'id') {
              if (!value.startsWith(prefix)) {
                value = prefix + value.replace(prefix, '');
              }

              const numericValue = value.replace(prefix, '');
              if (numericValue.length <= 5 && /^[0-9]*$/.test(numericValue)) {
                field.onChange(value);
              }
            } else if (type === 'number') {
              if (/^\d*\.?\d*$/.test(value)) {
                field.onChange(value);
              }
            } else if (type === 'truck') {
              if (/^\d*$/.test(value) && value.length <= 4) {
                field.onChange(value);
              }
            } else {
              field.onChange(value);
            }
          }}
          inputProps={{
            maxLength: getMaxLength(),
            pattern: type === 'number' ? '^\\d*\\.?\\d*$' : undefined,
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
