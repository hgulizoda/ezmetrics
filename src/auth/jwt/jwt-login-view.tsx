import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import logoImg from 'src/assets/data/logo.jpg';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(15, 15, 40, 0.6)',
    borderRadius: 1.5,
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.08)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.15)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255,255,255,0.25)',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.4)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    '&.Mui-focused': {
      color: 'rgba(255,255,255,0.7)',
    },
  },
};

const DEMO_CREDENTIALS = [
  { label: 'Admin', phone: 'admin', password: 'admin123' },
  { label: 'Manager', phone: 'manager', password: 'manager123' },
];

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    phone: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      await login?.(data.phone, data.password);
      router.push(PATH_AFTER_LOGIN);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Invalid credentials');
    }
  });

  const handleDemoClick = (phone: string, pwd: string) => {
    setValue('phone', phone);
    setValue('password', pwd);
  };

  return (
    <>
      {/* Logo & Brand */}
      <Stack spacing={1} sx={{ alignItems: 'center', mb: 5 }}>
        <img
          src={logoImg}
          alt="EZ Metric"
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            marginBottom: 8,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            color: '#fff',
            fontWeight: 300,
            letterSpacing: 2,
          }}
        >
          EZ Metric
        </Typography>
      </Stack>

      {/* Form */}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          {errorMsg && (
            <Alert
              severity="error"
              onClose={() => setErrorMsg('')}
              sx={{
                bgcolor: 'rgba(255, 86, 48, 0.12)',
                color: '#FF5630',
                border: '1px solid rgba(255, 86, 48, 0.2)',
                '& .MuiAlert-icon': { color: '#FF5630' },
                '& .MuiAlert-action .MuiIconButton-root': { color: '#FF5630' },
              }}
            >
              {errorMsg}
            </Alert>
          )}

          <RHFTextField
            name="phone"
            label="Username"
            type="text"
            sx={inputSx}
          />

          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={password.onToggle}
                    edge="end"
                    sx={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              mt: 1,
              bgcolor: '#fff',
              color: '#1a1a3e',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              textTransform: 'uppercase',
              borderRadius: 6,
              height: 48,
              boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                boxShadow: '0 6px 25px rgba(255,255,255,0.15)',
              },
            }}
          >
            Log In
          </LoadingButton>
        </Stack>
      </FormProvider>

      {/* Demo credentials */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        sx={{ mt: 4 }}
      >
        {DEMO_CREDENTIALS.map((cred) => (
          <Box
            key={cred.label}
            onClick={() => handleDemoClick(cred.phone, cred.password)}
            sx={{
              cursor: 'pointer',
              px: 2,
              py: 1,
              borderRadius: 1.5,
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.2s',
              '&:hover': {
                border: '1px solid rgba(255,255,255,0.2)',
                bgcolor: 'rgba(255,255,255,0.04)',
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                display: 'block',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                mb: 0.3,
              }}
            >
              {cred.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            >
              {cred.phone} / {cred.password}
            </Typography>
          </Box>
        ))}
      </Stack>
    </>
  );
}
