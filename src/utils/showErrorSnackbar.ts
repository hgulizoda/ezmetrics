import { enqueueSnackbar } from 'notistack';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showErrorSnackbar = (error: any) => {
  if (Array.isArray(error.response.data.message)) {
    enqueueSnackbar({
      variant: 'error',
      message: error.response.data.message.join('\n'),
    });
  } else {
    enqueueSnackbar({
      variant: 'error',
      message: error.response.data.message,
    });
  }
};
